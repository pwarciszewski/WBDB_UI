import React, { useEffect, useRef, useState } from 'react'
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


const findAvailableDevices = (frames_list) => {
    let devices_names_list = []
    for(let iteration of frames_list) {
        for(let frame of iteration.data_frames) {
            let temp_name = frame.data.data_source
            if(!devices_names_list.includes(temp_name)) {
                devices_names_list.push(temp_name)
            }
        }
    }
    return(devices_names_list)
}

const findAvailableIMGResults = (device_name, frames_list) => {
    let results_names_list = []
    for(let iteration of frames_list) {
        for(let frame of iteration.data_frames) {
            for(let result in frame.data.results) {
                console.log(result)
                if(frame.data.results[result].type === 'IMG' && frame.data.data_source === device_name) {
                    if(! results_names_list.includes(result)){
                        results_names_list.push(result)
                    }
                }
            }
        }
    }
    console.log(results_names_list)
    return(results_names_list)
}


const SelectedFramesList = () => {
    const active_iterations = useSelector(state => state.activeframes)
    const iter_focussed = active_iterations.find(iter => iter.focussed === true)

    const tileRef = useRef(null)
    const spaceRef = useRef(null)

    useEffect(() => scrollToRef(tileRef, spaceRef))

    const [selected_device, setSelectedDevice] = useState('INIT')
    const [selected_result, setSelectedResult] = useState('INIT')
    const available_devices = findAvailableDevices(active_iterations)
    const available_IMG_results = findAvailableIMGResults(selected_device, active_iterations)

    return(
        <div className="SelectedFramesList">
            <NavigButtons />
            <div className='SourceSelection'>
            <select value={selected_device} onChange={event=>setSelectedDevice(event.target.value)}>
                <option value={'INIT'}>Select device</option>
                {available_devices.map((device_name, index) => (<option key={index} value={device_name}>{device_name}</option>))}
            </select>
            <select value={selected_result} onChange={event=>setSelectedResult(event.target.value)}>
                <option value={'INIT'}>Select result</option>
                {available_IMG_results.map((result_name, index) => (<option key={index} value={result_name}>{result_name}</option>))}
            </select>
            </div>
            <div className='TilesSpace' ref={spaceRef}>
                {active_iterations.map((iteration) => {
                    if(iteration.iter_token === iter_focussed.iter_token) {
                        //PASS THE REFERENCE INTO THE DATATILE!!!!
                        return(<div ref={tileRef} key={iteration.iter_token}><DataTile key={iteration.iter_token} 
                                                                                       iter_frame={iteration}
                                                                                       img_source_device={selected_device}
                                                                                       img_source_result={selected_result}/></div>)
                    } else {
                        return(<div key={iteration.iter_token}><DataTile key={iteration.iter_token} 
                                                                         iter_frame={iteration}
                                                                         img_source_device={selected_device}
                                                                         img_source_result={selected_result}/></div>)
                    }
                })}
            </div>
        </div>
    )
}

export default SelectedFramesList