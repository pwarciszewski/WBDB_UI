import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ImageDisplayerRoi } from './components'
import { RoiRectangle, RoiPoint } from './components'
import { updateImageRoiXY, updateImageRoiWH } from '../../../../actions'
import './SelectRoi.css'


const SelectRoi = () => {
    const [currentImageSizeX, setImageSizeX] = useState(0)
    const [currentImageSizeY, setImageSizeY] = useState(0)

    const setSize = (width, height) => {
        setImageSizeX(width)
        setImageSizeY(height)
    }

    const dispatch = useDispatch()

    // PREVIOUSLY ALL Math.round functions were replaced with floor function for unknown reason
    // There might be an issue when dimension(height or widht) + pos (x or y) == max_img_size
    const translateRectDataToPos = (data) => {
        const scalling = currentImageSizeX/600
        if(scalling>1) {
            return({x: Math.round(data.x/scalling),
                    y: Math.round(data.y/scalling),
                    width: Math.round(data.width/scalling),
                    height: Math.round(data.height/scalling)})
        }
        else{
            return data
        }
    }

    const translatePointDataToPos = (data) => {
        const scalling = currentImageSizeX/600
        if(scalling>1) {
            return({x: Math.round(data.x/scalling - 12),
                    y: Math.round(data.y/scalling - 12)})
        }
        else{
            return({x: Math.round((data.x - 12)),
                    y: Math.round((data.y - 12))})
        }
    }

    const translateValToData = (val) => {
        const scalling = currentImageSizeX/600
        if(scalling>1) {
            return(Math.round(val*scalling))
        }
        else {
            return(val)
        }
    }
    
    const translatePointValToData = (val) => {
        const scalling = currentImageSizeX/600
        if(scalling>1) {
            return(Math.round(val*scalling + 12*scalling))
        }
        else {
            return(val + 12)
        }
    } 

    const updatePosition = (id, x, y) => {
        dispatch(updateImageRoiXY(id, translateValToData(x), translateValToData(y)))
    }

    const updatePointPostion = (id, x, y) => {
        dispatch(updateImageRoiXY(id, translatePointValToData(x), translatePointValToData(y)))
    }

    const updateSize = (id, x, y, w, h) => {
        dispatch(updateImageRoiXY(id, translateValToData(x), translateValToData(y)))
        dispatch(updateImageRoiWH(id, translateValToData(w), translateValToData(h)))
    }

    const all_rois = useSelector(state => state.imagerois)
    const rois_to_display = all_rois.filter(roi => roi.display_roi === true)

    const printRoi = (roi) => {
        switch(roi.roi_type) {
            case 'RECTANGLE':
                return <RoiRectangle key={roi.roi_id} id={roi.roi_id} placement={translateRectDataToPos(roi.roi_data)} onDrag={updatePosition} onResize={updateSize}/>
            case 'POINT':
                return <RoiPoint key={roi.roi_id} id={roi.roi_id} placement={translatePointDataToPos(roi.roi_data)} onDrag={updatePointPostion}/>
        }
    }

    return(
        <div className='SelectRoi'>
            <ImageDisplayerRoi imgOnload={setSize}>
                {rois_to_display.map(roi=> printRoi(roi))}
            </ImageDisplayerRoi>   
        </div>
    )
}

export default SelectRoi