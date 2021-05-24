import update from 'immutability-helper'

let ID = 0
let Z_INDEX = 0

//const initial_state = [{id:0, window_type: 'LogList', z_index: 0}, {id:1, window_type:'SelectedFrames', z_index: 0}]
//Potential overflow error, when Z_index > 2^31

const openwindows = (state = [], action) => {
    switch(action.type) {
        case 'ADD_WINDOW':
            ID = ID + 1
            Z_INDEX = Z_INDEX + 1
            return(
                [...state,
                    {id: ID, window_type: action.window_type, z_index: Z_INDEX} ]
            )
        case 'REMOVE_WINDOW':
            return(
                [...state.slice(0, state.findIndex(window => window.id === action.id)),
                 ...state.slice(state.findIndex(window => window.id === action.id) + 1)]
            )
        case 'FOCUS_WINDOW':
            let updated_state = state

            let window_index = state.findIndex(window => window.id === action.id)
            if(window_index !== -1) {
                if(state[window_index].z_index !== Z_INDEX) {
                    
                    Z_INDEX = Z_INDEX + 1
                    
                    updated_state = update(state, {
                        [window_index] : {z_index: {$set: Z_INDEX}}
                    })    
                }
            } 
            return(updated_state)
        default:
            return state
    }
}

export default openwindows
