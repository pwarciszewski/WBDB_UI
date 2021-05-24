import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addWindow } from '../../../../actions'
import './AddWindowSelection.css'


const findMaxZIndex = (state) => {
    let maxZ = 0
    for(const window of state){
        if(maxZ<window.z_index){
            maxZ = window.z_index
        }
    }
    return(maxZ + 1)
}


const AddWindowSelection = () => {
    const dispatch = useDispatch()

    const top_z_index = useSelector(state => findMaxZIndex(state.openwindows))
    
    return(
        <div className="AddWindowSelection">
            <div className="dropdown">Add new window {'\u25BC'}</div>
                <div className="dropdown-content" style={{zIndex : top_z_index}}>
                    <div className="dropdown-selection" onClick={()=>dispatch(addWindow('SelectedFrames'))}>Selected frames</div>
                    <div className="dropdown-selection" onClick={()=>dispatch(addWindow('LogList'))}>Application logs</div>
                    <div className="dropdown-selection" onClick={()=>dispatch(addWindow('AttributesList'))}>Attributes list</div>
                    <div className="dropdown-selection" onClick={()=>dispatch(addWindow('ImageDisplayer'))}>Image displayer</div>
                    <div className="dropdown-selection" onClick={()=>dispatch(addWindow('ROIs'))}>Display ROIs</div>
                    <div className="dropdown-selection" onClick={()=>dispatch(addWindow('RoiManager'))}>ROIs manager</div>
                    <div className="dropdown-selection" onClick={()=>dispatch(addWindow('ChartDisplayer'))}>Graph displayer</div>
                    <div className="dropdown-selection" onClick={()=>dispatch(addWindow('CSVDisplayer'))}>CSV displayer</div>
            </div>
        </div>
    )
}

export default AddWindowSelection
