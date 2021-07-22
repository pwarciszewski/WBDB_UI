import update from 'immutability-helper'

// State entry:
// {iter_token: string representing given iteration
//  data_frames: list of data frames in a given iteration
//  focussed: boolean representing if a given iteration is now focussed }

// data_frames list entry:
// This entry contains actuall information about collected and processed data:
// {id: int server side ID of a data frame
//  data: {name: string representing data frame,
//           sequence_name: string representing sequence name in which data was collected,
//          data_source: string representing source of the data i.e a device,
//           properties: object containing data frame properties in a following fashion: key: value,
//           results: object containing data frame results in a following fashion: key: {type: type_string, value: value_string},
//           iter_token: token for an iteration, should be same as higher level iter_token}

const mergeStateWithNewFrames = (old_state, new_frames) => {
    const current_focussed_index = old_state.findIndex(iter_frame => iter_frame.focussed === true)
    var temp_state = []
    if(current_focussed_index !== -1) {
        temp_state= update(old_state, {
            [current_focussed_index]: {focussed: {$set: false}}
        })
    }
    for(const frame of new_frames) {
        const destination_iter_token = frame.data.iter_token
        const index_to_put = temp_state.findIndex(iter_frame => iter_frame.iter_token === destination_iter_token)
        if(index_to_put === -1) {
            temp_state = [
                {iter_token: destination_iter_token, focussed: false, data_frames: [frame]},
                ...temp_state
            ]
        } else {
            temp_state[index_to_put].data_frames = [
                frame,
                ...temp_state[index_to_put].data_frames
            ]
        }
    }
    temp_state[0].focussed = true
    return(temp_state)
}


const activeframes = (state = [], action) => {
    let temp_list = []
    switch(action.type) {
        case 'SET_ACTIVE_FRAMES':
            temp_list = action.active_frames_list.reverse()
            temp_list.forEach(frame => frame.focussed = false)
            temp_list[0].focussed = true
            return temp_list
        case 'CLEAR_FRAMES':
            return []
        case 'ADD_ACTIVE_FRAMES':
            return(mergeStateWithNewFrames(state, action.new_frames))
        case 'REMOVE_ONE_OF_ACTIVE_FRAMES':
            let index = state.indexOf(action.frame_to_remove)
            let new_focussed_index
            if(state.length>1 & index+1<state.length){
                new_focussed_index = index + 1
            } else if (index+1 === state.length & index !== 0) {
                new_focussed_index = index - 1
            } else {
                new_focussed_index = index
            }
            let new_state = []
            if(state[index].focussed){
                new_state = update(state, {
                    [new_focussed_index]: {focussed: {$set: true}}
                })
            } else {
                new_state = state
            }
            return ([
                ...new_state.slice(0, index),
                ...new_state.slice(index+1)
            ])
        case 'SET_FOCUS':
            let new_focussed_index2 = state.indexOf(action.frame)
            let previous_index2 = state.findIndex(frame => frame.focussed === true)
            const new_state2 = update(state, {
                [previous_index2]: {focussed: {$set: false}},
                [new_focussed_index2]: {focussed: {$set: true}}
            })
            return new_state2
        case 'FOCUS_NEXT':
            const moveFocusForward = frame => {
                const index = state.indexOf(frame)
                const next_index = (index < state.length - 1)? index+1 : index
                const new_state = (state.length !== 0)? update(state, {
                    [index]: {focussed: {$set: false}},
                    [next_index]: {focussed: {$set: true}}
                }) : state
                return new_state
            }
            return(moveFocusForward(action.frame))
        case 'FOCUS_PREVIOUS':
            const moveFocusBack = frame => {
                const index = state.indexOf(frame)
                const next_index = (index > 0)? index-1 : index
                const new_state = (state.length !== 0)? update(state, {
                    [index]: {focussed: {$set: false}},
                    [next_index]: {focussed: {$set: true}}
                }) : state
                return new_state
            }
            return(moveFocusBack(action.frame))
        case 'UPDATE_ACTIVE_FRAMES':
            const createUpdatedState = (frames) => {
                let new_state = state
                for(const frame of frames){
                    const iter_index_to_update = state.findIndex(in_state_iter => in_state_iter.iter_token === frame.data.iter_token)
                    const index_to_update = state[iter_index_to_update].data_frames.findIndex(in_state_frame => in_state_frame.id === frame.id)
                    new_state = update(new_state, {
                        [iter_index_to_update]: {
                            data_frames: {
                                [index_to_update]: {data: {$set: frame.data}}}}
                    })
                }
            return new_state
            }
            return(createUpdatedState(action.frames_to_update))
        default:
            return state
    }
}

export default activeframes