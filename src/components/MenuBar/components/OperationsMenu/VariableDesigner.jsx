import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateOperation } from '../../../../actions'

const renderRoiOptions = (rois) => {
    const options = []
    for(const roi of rois) {
        for(const param in roi.roi_data){
        options.push(<option value={roi.roi_data[param]} key={'ID ' + roi.roi_id+'; ' + param}>{'ID ' + roi.roi_id+'; ' + param}</option>)
        }
    }
    return(options)
}


const VariableDesigner = ({index, param_name, value}) => {
    const dispatch = useDispatch()
    const available_rois = useSelector(state => state.imagerois)

    const handleRoiSelection = (value) => {
        if(value !== 'INIT') {
            dispatch(updateOperation(index, param_name, value))
        }
    }   

    return(
        <div className='VariableDesigner'>
            <label>{param_name + ': '}</label> 
            <input defaultValue={value} 
                   type="text" 
                   onChange={(event)=>dispatch(updateOperation(index, param_name, event.target.value))}></input>
            <select onChange={(event)=>handleRoiSelection(event.target.value)}>
                <option value='INIT'> Select ROI</option>
                {renderRoiOptions(available_rois)}
            </select>
        </div>
    )
}

export default VariableDesigner