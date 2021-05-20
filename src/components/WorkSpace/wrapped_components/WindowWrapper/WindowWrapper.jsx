import React from 'react'
import { useDispatch } from 'react-redux'
import { Rnd } from 'react-rnd'
import { removeWindow, focusWindow } from '../../../../actions'
import './WindowWrapper.css'

const WindowWrapper = (props) => {
    const dispatch = useDispatch()

    return(
        <Rnd bounds='.WorkSpace'
            className='WindowWrapper'
            dragHandleClassName = 'header'
            resizeGrid = {[20,20]}
            dragGrid = {[20,20]}
            default={{x:0, y:0, width: props.default_width, height: props.default_height}}
            lockAspectRatio={props.lock_aspect_ratio}
            enableResizing={props.resizable}
            onDragStart={()=>dispatch(focusWindow(props.id))}
            onClick={()=>dispatch(focusWindow(props.id))}
            style={{zIndex: props.z_index}}
        >
            <div className='header'>
                <div className='header-name'>
                    {props.window_name}
                </div>
                <div className='header-close' onClick={()=>dispatch(removeWindow(props.id))}>
                    {'\u2715'}
                </div>
            </div>
            {props.children}
        </Rnd>
    )
}

export default WindowWrapper