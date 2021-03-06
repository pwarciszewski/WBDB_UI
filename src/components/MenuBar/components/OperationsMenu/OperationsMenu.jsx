import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchOps, dispatchOperation, fetchRoutine } from '../../../../api'
import { updateActiveFrames, addLog, setNewRoutine} from '../../../../actions'
import { initializeOps } from '../../../../actions'
import './OperationsMenu.css'
import  Modal  from 'react-modal'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import Variable from './Variable'
import RoutinesDesigner from './RoutinesDesigner'

Modal.setAppElement('#root')

const customStyles = {
    content : {
      top                   : '40%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      fontFamily            : 'Arial, Helvetica, sans-serif',
      background            : '#f4f4f4'  
      
    },
    overlay : {
        backgroundColor: 'rgba(0,0,0,0.4)'
    }
  }

const renderOperationOption = (operation) => {
    const op_name = operation.operation_name
    return(<option key={op_name} value={op_name}>{op_name}</option>)
}

const renderGroupOption = (group_name) => {
    return(<option key={group_name} value={group_name}>{group_name}</option>)
}

const findFocussedFrame = (frames) => {
    for(const frame of frames) {
        if(frame.focussed === true) {
            return([frame.id])
        }
    }
    return([])
}

const findFramesForGroup = (frames, group_name) => {
    const frames_list = []
    for(const frame of frames){
        if(frame.data.sequence_name === group_name){
            frames_list.push(frame.id)
        }
    }
    return(frames_list)
}

const findDiferentFramesGroups = (frames) => {
    const frames_groups = []
    for(const frame of frames) {
        if(!frames_groups.includes(frame.data.sequence_name)) {
            frames_groups.push(frame.data.sequence_name)
        }
    }
    return(frames_groups)
}

const extractIds = (active_frames, group_name) => {
    if(group_name === 'FOCUSSED') {
        return(findFocussedFrame(active_frames))
    } else {
        return(findFramesForGroup(active_frames, group_name))
    }
}

const extractParameters = (operation_in, roi_in) => {
    const operation = (operation_in.hasOwnProperty('operation_properties')) ? operation_in : {'operation_properties':{'variables':{}}}
    const roi = (roi_in === undefined) ? {'roi_data':{}}:roi_in
    const extracted_params = {}
    for(const variable in operation.operation_properties.variables) {
        if(roi.roi_data.hasOwnProperty(variable)){
            extracted_params[variable] = roi.roi_data[variable]
        } else {
            extracted_params[variable] = operation.operation_properties.variables[variable]
        }
    }
    return(extracted_params)
}

const OperationsMenu = () => {
    const dispatch = useDispatch()

    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => {
        fetchRoutine(data => dispatch(setNewRoutine(data)))
        fetchOps(data => dispatch(initializeOps(data)))
        setShow(true)
    }

    const available_operations = useSelector(state => state.availableops)
    const active_frames = useSelector(state => state.activeframes)
    const frames_groups = findDiferentFramesGroups(active_frames)
    const [selected_group, setSelectedGroup] = useState('FOCUSSED')

    const [selected_op_object, setSelectedOpObj] = useState({})
    const [selected_op_name, setSelectedOp] = useState('INIT')

    const available_rois = useSelector(state => state.imagerois)
    const [selected_roi, setSelectedRoi] = useState('INIT')

    const handleOperationSelection = (op_name) => {
        setSelectedOp(op_name)
        setSelectedOpObj(available_operations.find(op=>op.operation_name === op_name))
    }

    const prepareTailoredSetSelectedOpObj = (obj, variable, value) => {
        const newobj = obj
        newobj.operation_properties.variables[variable] = value
        setSelectedOpObj(newobj)
    }

    const renderParamsForOperation = (operation, roi_in) => {
        const rendered_variables = []
        const roi = (roi_in === undefined) ? {}:roi_in
        try {
        for(const variable in operation.operation_properties.variables){
            if(roi.hasOwnProperty('roi_data')){
            if(!roi.roi_data.hasOwnProperty(variable)){
                rendered_variables.push(<Variable variable={variable} 
                value={operation.operation_properties.variables[variable]}
                handleValueChange={(value) => prepareTailoredSetSelectedOpObj(selected_op_object, variable, value)} 
                key={variable}></Variable>)
            }} else {
                rendered_variables.push(<Variable variable={variable} 
                value={operation.operation_properties.variables[variable]}
                handleValueChange={(value) => prepareTailoredSetSelectedOpObj(selected_op_object, variable, value)} 
                key={variable}></Variable>)
            }
        }   
        } catch (error) {
            return(<h4>Select operation</h4>)
        }
        return(rendered_variables)
    }

    return(
        <div className="OperationsMenuButton">
            <button onClick={()=>handleShow(true)}>Operations menu</button>
            <Modal isOpen={show} 
                   style={customStyles}
                   shouldCloseOnOverlayClick={true}
                   onRequestClose={()=>handleClose(false)}
            > 
            <Tabs>
                <TabList>
                    <Tab>Dispatch operation</Tab>
                    <Tab>Routines designer</Tab>
                </TabList>
                <TabPanel>
                <div>
                    <h2>Operations Menu</h2>
                    <h3>Selected frames</h3>
                    <select value={selected_group} onChange={event=>setSelectedGroup(event.target.value)}>
                        <option key='FOCUSSED' value='FOCUSSED'>Currently focussed frame</option>
                        {frames_groups.map(group_name => renderGroupOption(group_name))}
                    </select>
                    <h3>Operation options</h3>
                    <select value={selected_op_name} onChange={event=>handleOperationSelection(event.target.value)}>
                        <option key='INIT' value='INIT'> Select operation</option>
                        {available_operations.map(operation => renderOperationOption(operation))}
                    </select> <br />
                    bind to ROI:
                    <select value={selected_roi} onChange={event=>setSelectedRoi(event.target.value)}>
                        <option value={'INIT'}> Nothing </option>
                        {available_rois.map(roi=><option key={roi.roi_id} value={roi.roi_id}>ID: {roi.roi_id}</option>)}
                    </select>
                    {renderParamsForOperation(selected_op_object, available_rois.find((roi)=>(roi.roi_id == selected_roi)))}
                </div>
                <div>
                    <button onClick={()=>{
                        if(selected_op_name!=='INIT'){
                            dispatchOperation(extractIds(active_frames, selected_group),
                                              extractParameters(selected_op_object, available_rois.find((roi)=>(roi.roi_id == selected_roi))),
                                              selected_op_name,
                                              data=>dispatch(addLog(data)),
                                              data=>dispatch(updateActiveFrames(data)))}}
                        }>Dispatch!</button>
                </div>
                </TabPanel>
                <TabPanel>
                    <RoutinesDesigner />
                </TabPanel>
            </Tabs>  

            </Modal>
        </div>
    )
}

export default OperationsMenu