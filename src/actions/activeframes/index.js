export const setActiveFrames = active_frames_list => ({
    type: 'SET_ACTIVE_FRAMES',
    active_frames_list
})

export const updateActiveFrames = frames_to_update => ({
    type: 'UPDATE_ACTIVE_FRAMES',
    frames_to_update
})

export const addActiveFrame = new_frames => ({
    type: 'ADD_ACTIVE_FRAMES',
    new_frames
})

export const removeActiveFrame = frame_to_remove => ({
    type: 'REMOVE_ONE_OF_ACTIVE_FRAMES',
    frame_to_remove
})

export const setFocus = frame => ({
    type: 'SET_FOCUS',
    frame
})

export const focusNext = frame => ({
    type: 'FOCUS_NEXT',
    frame
})

export const focusPrevious = frame => ({
    type: 'FOCUS_PREVIOUS',
    frame
})

export const clearFrames = () => ({
    type: 'CLEAR_FRAMES'
})