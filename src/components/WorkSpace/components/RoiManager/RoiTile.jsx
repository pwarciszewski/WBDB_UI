import React from 'react'
import { useDispatch } from 'react-redux'
import { setRoiDisplay, removeRoi } from '../../../../actions'
import './RoiTile.css'


const RoiTile = ({ roi }) => {

    const dispatch = useDispatch()

    return(
        <div className='RoiTile'>
            ROI ID: {roi.roi_id} <input type='checkbox' checked={roi.display_roi} onClick={() => dispatch(setRoiDisplay(roi.roi_id, !roi.display_roi))}></input> 
            <div className="close" onClick={() => dispatch(removeRoi(roi.roi_id))} >
            {'\u2715'}
            </div>
            
            <br/> 
            type: {roi.roi_type} <br/>
            {JSON.stringify(roi.roi_data, null, 1)}
        </div>
    )
}

export default RoiTile