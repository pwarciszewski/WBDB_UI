import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import  Attribute  from './Attribute'
import './FrameAttributes.css'


const FrameAttributesList = () => {
    const selected_frame = useSelector(state => state.activeframes).find(frame => frame.focussed === true)

    const parseFrame = (frame, selection) => {
        if(frame === undefined) {
            return []
        }
        else {
            let parsed = []
            let selected_data = (selection === 'PROPS')? selected_frame.data.properties : selected_frame.data.results
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
            <select value={selected_option} onChange={event=>setSelectedOption(event.target.value)}>
                <option value={'PROPS'}>Properties</option>
                <option value={'RES'}>Results</option>
            </select>
            </label>
            <div className='tableSpace'>
            <table>
                <tbody>
                    {renderPreamble()}
                    {parseFrame(selected_frame, selected_option).map((attribute, index) => (<Attribute key={index} props={attribute} />))}
                </tbody>
            </table>
            </div>
        </div>
    )
}


export default FrameAttributesList