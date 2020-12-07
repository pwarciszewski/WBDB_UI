import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import  Attribute  from './Attribute'
import './FrameAttributes.css'


const findAvailableDevices = (iteration) => {
    let devices_names_list = []
    if(iteration !== undefined){
        for(let device of iteration.data_frames) {
            let temp_name = device.data.data_source
               if(!devices_names_list.includes(temp_name)) {
                   devices_names_list.push(temp_name)
               }
        }
    }
    return(devices_names_list)
}


const FrameAttributesList = () => {
    const selected_iter_frames = useSelector(state => state.activeframes).find(iter => iter.focussed === true)
    const available_devices = findAvailableDevices(selected_iter_frames)

    const parseIteration = (iter, selection, device) => {
        if(iter === undefined || device === 'INIT') {
            return []
        }
        else {
            let parsed = []
            let selected_device_index = iter.data_frames.findIndex(frame => frame.data.data_source === device)
            if(selected_device_index === -1) {
                return []
            }
            let selected_data = (selection === 'PROPS')? 
                iter.data_frames[selected_device_index].data.properties : iter.data_frames[selected_device_index].data.results
            for(let item in selected_data){
                if(selection === 'RES'){
                    parsed.push({name: item, type: selected_data[item].type, value: selected_data[item].value})
                }
                else {
                    parsed.push({name: item, value: selected_data[item]})
                }
            }
            return parsed
        }
    }

    const [selected_option, setSelectedOption] = useState('PROPS')
    const [selected_device, setSelectedDevice] = useState('INIT')


    const renderPreamble = () => {
        if(selected_option === 'RES') {
            return(
                <tr>
                    <th>
                        Result Name
                    </th>
                    <th>
                        Result Type
                    </th>
                    <th>
                        Result Value
                    </th>
                </tr>
            )
        } else {
            return(
                <tr>
                    <th>
                        Property Name
                    </th>
                    <th>
                        Property Value
                    </th>
                </tr>
            )
            
        }
    }

    return(
        <div className="FrameAttributesList">
            <label>
            Display: 
            <select value={selected_device} onChange={event=>setSelectedDevice(event.target.value)}>
                <option value={'INIT'}>Select device</option>
                {available_devices.map((dev_name, index)=>(<option key={index} value={dev_name}>{dev_name}</option>))}
            </select>
            <select value={selected_option} onChange={event=>setSelectedOption(event.target.value)}>
                <option value={'PROPS'}>Properties</option>
                <option value={'RES'}>Results</option>
            </select>
            </label>
            <div className='tableSpace'>
            <table>
                <tbody>
                    {renderPreamble()}
                    {parseIteration(selected_iter_frames, selected_option, selected_device)
                        .map((attribute, index) => (<Attribute key={index} props={attribute} />))}
                </tbody>
            </table>
            </div>
        </div>
    )
}


export default FrameAttributesList