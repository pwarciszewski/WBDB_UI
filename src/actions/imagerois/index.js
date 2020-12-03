export const addImageRoi = (roi_type, roi_data, display_roi) => ({
    type: 'ADD_IMAGE_ROI',
    roi_type,
    roi_data,
    display_roi
})

export const updateImageRoiXY = (roi_id, roi_new_x, roi_new_y) => ({
    type: 'UPDATE_IMAGE_ROI_XY',
    roi_id,
    roi_new_x,
    roi_new_y
})

export const updateImageRoiWH = (roi_id, roi_new_w, roi_new_h) => ({
    type: 'UPDATE_IMAGE_ROI_WH',
    roi_id,
    roi_new_w,
    roi_new_h
})

export const setRoiDisplay = (roi_id, display_roi) => ({
    type: 'SET_ROI_DISPLAY',
    roi_id,
    display_roi
})

export const removeRoi = (roi_id) => ({
    type: 'REMOVE_ROI',
    roi_id
})