export const setNewRoutine = (new_routine) => ({
    type: 'SET_NEW_ROUTINE',
    new_routine
})

export const removeOperation = (index) => ({
    type: 'REMOVE_OPERATION',
    index
})

export const addOperation = (operation) => ({
    type: 'ADD_OPERATION',
    operation
})

export const updateOperation = (index, param, value) => ({
    type: 'CHANGE_OPERATION',
    index,
    param,
    value
})

export default setNewRoutine