import update from 'immutability-helper'

let ROI_ID = 0

const imagerois = (state = [], action) => {
    switch(action.type) {
        case 'ADD_IMAGE_ROI':
            ROI_ID = ROI_ID + 1
            return(
                [...state,
                { roi_id: ROI_ID,
                  roi_type: action.roi_type,
                  roi_data: action.roi_data,
                  display_roi: action.display_roi}]
            )
        case 'UPDATE_IMAGE_ROI_XY':
            const updateRoiDataXY = () => {
                const index = state.findIndex(roi => roi.roi_id === action.roi_id)
                const newstate = update(state, {
                    [index]: {roi_data: {x: {$set: action.roi_new_x}, y: {$set: action.roi_new_y}}},
                })
                return newstate
            }
            return updateRoiDataXY()
        case 'UPDATE_IMAGE_ROI_WH':
            const updateRoiDataWH = () => {
                const index = state.findIndex(roi => roi.roi_id === action.roi_id)
                const newstate = update(state, {
                    [index]: {roi_data: {width: {$set: action.roi_new_w}, height: {$set: action.roi_new_h}}},
                })
                return newstate
            }
            return updateRoiDataWH()
        
        case 'SET_ROI_DISPLAY':
            const setRoiDisplay = () => {
                const index = state.findIndex(roi => roi.roi_id === action.roi_id)
                const newstate = update(state, {
                    [index]: {display_roi: {$set: action.display_roi}},
                })
                return newstate
            }
            return setRoiDisplay()
        
        case 'REMOVE_ROI':
            return(
                [...state.slice(0, state.findIndex(roi => roi.roi_id === action.roi_id)),
                 ...state.slice(state.findIndex(roi => roi.roi_id === action.roi_id) + 1)]
            )

        default:
            return state
    }
}

export default imagerois