import React from 'react'
import { SERVER_IP_IMG } from '../../../../../api'


const prepareImgUrl = (data_frame, selection) => {
    let url = ''
    try{
        url = data_frame.data.results[selection].value
        url = SERVER_IP_IMG + url
    }
    catch(e)
    {
        url = SERVER_IP_IMG + '/static/DataBrowse/img/no_img.png'
    }
    return(url)
}


const ImageSpaceRoi = (props) => {

    return(
        <div className='SelectedImageRoi'>
             <img className='ImageRoi' src={prepareImgUrl(props.data_frame, props.selection)} onLoad={(e)=>props.imgOnload(e.target.naturalWidth, e.target.naturalHeight)}/>
             {props.children}
        </div>
       
    )

}

export default ImageSpaceRoi