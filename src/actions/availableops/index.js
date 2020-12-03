export const initializeOps = available_ops_list => ({
    type: 'INITIALIZE_OPERATIONS',
    available_ops_list
})

export const updateOp = updated_operation => ({
    type: 'UPDATE_OPERATION',
    updated_operation
})