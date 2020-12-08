import React, { useState } from 'react'
import { useSelector } from 'react-redux' 
import ImageSpaceRoi from './ImageSpaceRoi'
import './ImageDisplayerRoi.css'


const getAvailableDevices = (frames_list) => {
    let devices_names_list = []
    if(frames_list !== undefined){
        for(let frame of frames_list.data_frames) {
            let temp_name = frame.data.data_source
            if(!devices_names_list.includes(temp_name)) {
                devices_names_list.push(temp_name)
            }
        }
    }
    return(devices_names_list)
}


const getAvailableResults = (selected_iteration, selected_device) => {
    let results = []
    if(selected_iteration !== undefined){
        let device_index = selected_iteration.data_frames.findIndex(frame=>frame.data.data_source === selected_device)
        if(device_index === -1) {
            return ['None']
        }
        for(let result in selected_iteration.data_frames[device_index].data.results){
            if(selected_iteration.data_frames[device_index].data.results[result].type === 'IMG'){
                results.push(result)
            }
        }
    } else {
        results.push('None')
    }

    return results
}


const ImageDisplayerRoi = (props) => {
    const selected_iteration = useSelector(state => state.activeframes).find(iteration => iteration.focussed === true)

    const [selected_device, setSelectedDevice] = useState('INIT')
    const [selected_result, setSelectedResult] = useState('INIT')
    
    const avail_devices = getAvailableDevices(selected_iteration)
    const avail_img_results = getAvailableResults(selected_iteration, selected_device)
    
    return(
    <div className='ImageDisplayerRoi'>
        <div className ='ResultSelect'>
            <select  value={selected_device} onChange={event=>setSelectedDevice(event.target.value)}>
                <option value={'INIT'}>Select device</option>
                {avail_devices.map((device, index) => (<option key={index} value={device}>{device}</option>))}
            </select>
            <select  value={selected_result} onChange={event=>setSelectedResult(event.target.value)}>
                <option value={'INIT'}>Select result to show</option>
                {avail_img_results.map((result, index) => (<option key={index} value={result}>{result}</option>))}
            </select>
        </div>

        <ImageSpaceRoi iter_frame={selected_iteration} result={selected_result} device={selected_device} imgOnload={props.imgOnload}>
            {props.children}
        </ImageSpaceRoi>
    </div>
    )
}

export default ImageDisplayerRoi