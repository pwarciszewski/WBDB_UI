export const addWindow = window_type => ({
    type: 'ADD_WINDOW',
    window_type
})

export const removeWindow = id => ({
    type: 'REMOVE_WINDOW',
    id
})