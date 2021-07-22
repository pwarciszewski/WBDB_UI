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


const selectWindow = ({id, window_type, z_index}) => {
    switch(window_type) {
        case 'SelectedFrames':
            return(<WrappedSelectedFramesList key={id} id={id} z_index={z_index}/>)
        case 'LogList':
            return(<WrappedLogList key={id} id={id} z_index={z_index}/>)
        case 'AttributesList':
            return(<WrappedAttributesList key={id} id={id} z_index={z_index}/>)
        case 'ImageDisplayer':
            return(<WrappedImageDisplayer key={id} id={id} z_index={z_index}/>)
        case 'ROIs':
            return(<WrappedSelectRoi key={id} id={id} z_index={z_index}/>)
        case 'RoiManager':
            return(<WrappedRoiManager key={id} id={id} z_index={z_index}/>)
        case 'ChartDisplayer':
            return(<WrappedChartDisplayer key={id} id={id} z_index={z_index}/>)
        case 'CSVDisplayer':
            return(<WrappedCSVDisplayer key={id} id={id} z_index={z_index}/>)
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