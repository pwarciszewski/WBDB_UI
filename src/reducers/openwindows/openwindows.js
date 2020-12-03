let ID = 0

//const initial_state = [{id:0, window_type: 'LogList'}, {id:1, window_type:'SelectedFrames'}]

const openwindows = (state = [], action) => {
    switch(action.type) {
        case 'ADD_WINDOW':
            ID = ID + 1
            return(
                [...state,
                    {id: ID, window_type: action.window_type} ]
            )
        case 'REMOVE_WINDOW':
            return(
                [...state.slice(0, state.findIndex(window => window.id === action.id)),
                 ...state.slice(state.findIndex(window => window.id === action.id) + 1)]
            )
        default:
            return state
    }
}

export default openwindows
