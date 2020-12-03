import React from 'react'
import { useDispatch } from 'react-redux'
import { removeOperation } from '../../../../actions'
import VariableDesigner from './VariableDesigner'


const Operation = ({operation, index}) => {
    const dispatch = useDispatch()

    const renderVariables = () => {
        const vars_list = []
        for(const variable in operation.params){
            vars_list.push(<VariableDesigner key={variable} index={index} param_name={variable} value={operation.params[variable]} />)
        }
        return(vars_list)
    }

    return(
        <div className='Operation'>
            <div>
                {operation.operation} <button className='close' onClick={()=>dispatch(removeOperation(index))}>{'\u2715'}</button>
            </div>
            <div>
                {renderVariables()}
            </div>
        </div>

    )
}

export default Operation