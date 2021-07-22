import React from 'react'
import { SERVER_IP_IMG } from '../../../../api'


const prepareImgUrl = (iter_frame, result, device) => {
    let url = ''
    try{
        let dev_index = iter_frame.data_frames.findIndex(frame=>frame.data.data_source === device)
        url = iter_frame.data_frames[dev_index].data.results[result].value
        url = SERVER_IP_IMG + url
    }
    catch(e)
    {
        url = SERVER_IP_IMG + '/static/DataBrowse/img/no_img.png'
    }
    return(url)
}


const ImageSpace = (props) => {
    return(
             <img className='SelectedImage' src={prepareImgUrl(props.iter_frame, props.result, props.device)} />
    )

}

export default ImageSpace