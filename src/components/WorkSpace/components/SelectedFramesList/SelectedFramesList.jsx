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
    const active_iterations = useSelector(state => state.activeframes)
    const iter_focussed = active_iterations.find(iter => iter.focussed === true)

    const tileRef = useRef(null)
    const spaceRef = useRef(null)

    useEffect(() => scrollToRef(tileRef, spaceRef))

    return(
        <div className="SelectedFramesList">
            <NavigButtons />
            <div className='TilesSpace' ref={spaceRef}>
                {active_iterations.map((iteration) => {
                    if(iteration.iter_token === iter_focussed.iter_token) {
                        return(<div ref={tileRef} key={iteration.iter_token}><DataTile key={iteration.iter_token} iter_frame={iteration}/></div>) //PASS THE REFERENCE INTO THE DATATILE!!!!
                    } else {
                        return(<div key={iteration.iter_token}><DataTile key={iteration.iter_token} iter_frame={iteration}/></div>)
                    }
                })}
            </div>
        </div>
    )
}

export default SelectedFramesList