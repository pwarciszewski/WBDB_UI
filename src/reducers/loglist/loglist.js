const state_max_len = 200

const initial_log = 'Welcome to WBDB UI!'

const loglist = (state = [initial_log], action) => {
    switch(action.type) {
        case 'ADD_LOG':
            const prepareStateWithAddedLog = text => {
                const new_state = (state.length < state_max_len)?
                [...state, text] :
                [...state.slice(1, state_max_len), text]
                return new_state
            }
            return prepareStateWithAddedLog(action.text)
        default:
            return state
    }
}

export default loglist