const serverroutine = (state = [], action) => {
    switch(action.type){
        case 'SET_NEW_ROUTINE':
            return [ action.new_routine ]
        case 'ADD_OPERATION':
            const addOperation = (operation) => {
                const updated_routine = state[0]
                updated_routine.push(operation)
                return(updated_routine)
            }
            return([ addOperation(action.operation) ])

        case 'REMOVE_OPERATION':
            const removeOperation = (index) => {
                const updated_routine = [...state[0].slice(0, index), ...state[0].slice(index+1)]
                return(updated_routine)
            }

            return([ removeOperation(action.index) ])

        case 'CHANGE_OPERATION':
            const updateOperation = (index, param, value) => {
                const routine = state[0]
                routine[index].params[param] = value
                return(routine)
            }

            return([updateOperation(action.index, action.param, action.value)])

        default:
            return state
    }
}

export default serverroutine