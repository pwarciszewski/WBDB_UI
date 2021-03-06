import React, { useState } from 'react'
import { useSelector } from 'react-redux' 
import ImageSpaceRoi from './ImageSpaceRoi'
import './ImageDisplayerRoi.css'

function getAvailResults(selected_frame){
    let results = []
    if(selected_frame !== undefined){
        for(let result in selected_frame.data.results){
            if(selected_frame.data.results[result].type === 'IMG'){
                results.push(result)
            }
        }
    } else {
        results.push('None')
    }

    return results
}

const ImageDisplayerRoi = (props) => {
    const selected_frame = useSelector(state => state.activeframes).find(frame => frame.focussed === true)

    const avail_img_results = getAvailResults(selected_frame)
    
    const [selected_result, setSelectedResult] = useState('INIT')

    return(
    <div className='ImageDisplayerRoi'>
        <div className ='ResultSelect'>
        <select  value={selected_result} onChange={event=>setSelectedResult(event.target.value)}>
            <option value={'INIT'}>Select result to show</option>
            {avail_img_results.map((result, index) => (<option key={index} value={result}>{result}</option>))}
        </select>
        </div>

        <ImageSpaceRoi data_frame={selected_frame} selection={selected_result} imgOnload={props.imgOnload}>
            {props.children}
        </ImageSpaceRoi>
    </div>
    )
}

export default ImageDisplayerRoi