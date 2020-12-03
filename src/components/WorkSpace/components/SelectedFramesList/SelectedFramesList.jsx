import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import DataTile from './DataTile'
import NavigButtons from './NavigButtons'
import './SelectedFramesList.css'


const scrollToRef = (ref, spaceRef) => {
    if(ref.current !== null){
        const offset = ref.current.offsetTop - spaceRef.current.scrollTop
        if(offset > spaceRef.current.clientHeight || offset < 0) {
            spaceRef.current.scrollTo(0, ref.current.offsetTop - 100)
        }
    }
}
                                                            

const SelectedFramesList = () => {
    const active_frames = useSelector(state => state.activeframes)
    const frame_focussed = active_frames.find(frame => frame.focussed === true)

    const tileRef = useRef(null)
    const spaceRef = useRef(null)

    useEffect(() => scrollToRef(tileRef, spaceRef))

    return(
        <div className="SelectedFramesList">
            <NavigButtons />
            <div className='TilesSpace' ref={spaceRef}>
                {active_frames.map((frame) => {
                    if(frame.id === frame_focussed.id) {
                        return(<div ref={tileRef} key={frame.id}><DataTile key={frame.id} data_frame={frame}/></div>) //PASS THE REFERENCE INTO THE DATATILE!!!!
                    } else {
                        return(<div key={frame.id}><DataTile key={frame.id} data_frame={frame}/></div>)
                    }
                })}
            </div>
        </div>
    )
}

export default SelectedFramesList