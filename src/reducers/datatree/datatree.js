const datatree = (state = [], action) => {
    switch(action.type) {
        case 'LOAD_DATATREE':
            return action.new_data_tree
        default:
            return state
    }
}

export default datatree