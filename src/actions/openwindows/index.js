export const addWindow = window_type => ({
    type: 'ADD_WINDOW',
    window_type
})

export const removeWindow = id => ({
    type: 'REMOVE_WINDOW',
    id
})

export const focusWindow = id => ({
    type: 'FOCUS_WINDOW',
    id
})