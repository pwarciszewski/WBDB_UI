import React from 'react'
import './NavigButtons.css'
import { useDispatch, useSelector } from 'react-redux'
import { focusPrevious, focusNext, clearFrames } from '../../../../actions'

const NavigButtons = () => {
    const dispatch = useDispatch()

    const active_frames = useSelector(state => state.activeframes)
    const frame_focussed = active_frames.find(frame => frame.focussed === true)

    return (
        <div className={'NavigButtons'}>
            <button className={'NavigButton'} onClick={()=>dispatch(focusPrevious(frame_focussed))}> {'\u25C0'} </button>
            <button className={'NavigButton'} onClick={()=>dispatch(clearFrames())}> Clear </button>
            <button className={'NavigButton'} onClick={()=>dispatch(focusNext(frame_focussed))}> {'\u25B6'} </button>
        </div>
    )
}

export default NavigButtons