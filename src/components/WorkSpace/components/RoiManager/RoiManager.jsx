import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addImageRoi } from '../../../../actions'
import RoiTile from './RoiTile'
import './RoiManager.css'

const RECTANGLE_DEF = {x:0,y:0,width:200,height:200}
const POINT_DEF = {x:200,y:200}

const RoiManager = () => {
    const dispatch = useDispatch()
    
    const all_rois = useSelector(state => state.imagerois)
    
    return(
    <div className='RoiManager'>
        <div className='RoiButtons'>
            <button className='AddButton' onClick={()=>dispatch(addImageRoi('RECTANGLE', RECTANGLE_DEF, true))}>Add rectangle</button>
            <button className='AddButton' onClick={()=>dispatch(addImageRoi('POINT', POINT_DEF, true))}>Add point</button>
        </div>
        <div className='RoisList'>
            {all_rois.map(roi=>(
                <RoiTile key={roi.roi_id} roi={roi}/>
            ))}
        </div>    
    </div>
    )
}

export default RoiManager