import update from 'immutability-helper'

// State entry:
// {iter_token: string representing given iteration
//  data_frames: list of data frames in a given iteration
//  focussed: boolean representing if a given iteration is now foccussed }

// data_frames list entry:
// This entry contains actuall information about collected and processed data:
// {id: int server side ID of a data frame
//  data: {name: string representing data frame,
//           sequence_name: string representing sequence name in which data was collected,
//          data_source: string representing source of the data i.e a device,
//           properties: object containing data frame properties in a following fashion: key: value,
//           results: same as above but for server generated results
//           iter_token: token for an iteration, should be same as higher level iter_token}
//


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
            temp_list = action.new_frames
            temp_list.forEach(frame => frame.focussed = false)
            temp_list[0].focussed = true
            const cleanted_old_state = state.map(frame => ({...frame, focussed: false}))
            return ([
                ...temp_list,
                ...cleanted_old_state
            ])
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
                    const index_to_update = state.indexOf(state.find(in_state_frame => in_state_frame.id === frame.id))
                    new_state = update(new_state, {
                        [index_to_update]: {data: {$set: frame.data}}
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