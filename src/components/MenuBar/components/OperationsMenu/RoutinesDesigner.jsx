import React , { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Operation from './Operation'
import { addOperation, addLog } from '../../../../actions'
import { uploadNewRoutine } from '../../../../api'

const renderOperationsForRoutine = (routine) => {
    const operations_list = []
    for(const [i, operation] of routine.entries()) {
        operations_list.push(<Operation operation={operation} index={i} key={i} />)
    }
    return(operations_list)
}

const formatOperationForRoutine = (operation) => {
    return({'operation': operation.operation_name, 'params':operation.operation_properties.variables})
} 

const renderOptionsForOperationSelection = (ops) => {
    const ops_list = []
    for(const op of ops){
        ops_list.push(<option value={JSON.stringify(formatOperationForRoutine(op))} key={op.operation_name}>{op.operation_name}</option>)
    }
    return ops_list
}


const RoutinesDesigner = () => {
    const dispatch = useDispatch()

    const routine = useSelector(state => state.serverroutine)[0]
    const avail_ops = useSelector(state => state.availableops)

    const [selected_operation, setSelectedOperation] = useState('INIT')

    const addSelectedOperation = (operation) => {
        if(operation !== 'INIT') {
            dispatch(addOperation(JSON.parse(operation)))
        }
    }

    return(
        <div>
            <div>
                <select value={selected_operation} onChange={(e) => setSelectedOperation(e.target.value)}>
                    <option value='INIT'>Select operation</option>
                    {renderOptionsForOperationSelection(avail_ops)}
                </select>
                <button onClick={()=>addSelectedOperation(selected_operation)}>Add operation</button>
            </div>
            <div>
                {renderOperationsForRoutine(routine)}
            </div>
            <div className='UploadNewRoutineSpace'>
                <button onClick={()=>uploadNewRoutine(routine, (text)=>dispatch(addLog(text)))}>Upload new routine</button>
            </div>
        </div>
    )
}

export default RoutinesDesigner