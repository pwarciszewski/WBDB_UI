import React from 'react'
import { useSelector } from 'react-redux'
import './WorkSpace.css'
import { WrappedLogList, 
         WrappedSelectedFramesList, 
         WrappedAttributesList, 
         WrappedImageDisplayer, 
         WrappedSelectRoi, 
         WrappedRoiManager,
         WrappedChartDisplayer,
         WrappedCSVDisplayer } from './wrapped_components'


const selectWindow = ({id, window_type}) => {
    switch(window_type) {
        case 'SelectedFrames':
            return(<WrappedSelectedFramesList key={id} id={id}/>)
        case 'LogList':
            return(<WrappedLogList key={id} id={id}/>)
        case 'AttributesList':
            return(<WrappedAttributesList key={id} id={id}/>)
        case 'ImageDisplayer':
            return(<WrappedImageDisplayer key={id} id={id}/>)
        case 'ROIs':
            return(<WrappedSelectRoi key={id} id={id}/>)
        case 'RoiManager':
            return(<WrappedRoiManager key={id} id={id}/>)
        case 'ChartDisplayer':
            return(<WrappedChartDisplayer key={id} id={id}/>)
        case 'CSVDisplayer':
            return(<WrappedCSVDisplayer key={id} id={id}/>)
        default:
            console.log('Unknown window')
    }
}


const WorkSpace = () => {
    const windows = useSelector(state => state.openwindows)
    return(
        <div className='WorkSpace'>
            {windows.map(window => selectWindow(window))}
        </div>
    )
}

export default WorkSpace