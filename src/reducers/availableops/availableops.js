import update from 'immutability-helper'

// State entry:
//  {operation_name: "<some_name>" ,
//   operation_properties: {
//    type: "<op_type>"
//    variables: {object containing variables represented as "var_name":value}  
//  }}

const availableops = (state = [], action) => {
    switch(action.type) {
        case 'INITIALIZE_OPERATIONS':
            const new_ops = []
            for(const operation in action.available_ops_list){
                if(!state.some(entry => entry.operation_name === operation)) {
                    new_ops.push({'operation_name': operation, 'operation_properties':action.available_ops_list[operation]})
                }
            }
            return(
                [...state,
                 ...new_ops]
            )
        case 'UPDATE_OPERATION':
            let index_to_update = state.findIndex(op => op.operation_name === action.updated_operation.operation_name)
            const updated_state = update(state, {
                [index_to_update]: {operation_properties: {$set: action.updated_operation.operation_properties}}
            })
            return(updated_state)
        default:
            return state
    }
}

export default availableops