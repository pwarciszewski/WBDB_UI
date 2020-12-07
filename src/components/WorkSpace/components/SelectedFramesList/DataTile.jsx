import React from 'react'
import { removeActiveFrame, setFocus } from '../../../../actions'
import { useDispatch } from 'react-redux'
import './DataTile.css'
import { SERVER_IP_IMG } from '../../../../api'


const prepareImgUrl = (iter_frame, source_device, source_result) => {
    let url = ''
    try{
        let frame_index_in_iteration = iter_frame.data_frames.findIndex((frame) => (frame.data.data_source == source_device))
        url = iter_frame.data_frames[frame_index_in_iteration].data.results[source_result].value
        url = SERVER_IP_IMG + url
    }
    catch(e)
    {
        url = SERVER_IP_IMG + '/static/DataBrowse/img/no_img.png'
    }
    return(url)
}


const DataTile = ({ iter_frame, img_source_device, img_source_result }) => {
    const dispatch = useDispatch()
    return(
        <div className="DataTile" 
             focussed={iter_frame.focussed.toString()} >
            <div className="TileContent" onClick={()=>dispatch(setFocus(iter_frame))}>
                <img className="TileImage" src={prepareImgUrl(iter_frame, img_source_device, img_source_result)} 
                                           height={70} 
                                           width={70}/>
                    {iter_frame.data_frames[0].data.sequence_name}
                <div className='FileList'>
                    Files' sources in this iteration:
                    {iter_frame.data_frames.map((data_element) => {
                        return(<div key = {data_element.id}> {data_element.data.data_source} </div>)
                    })}
                </div>
            </div>
            
            <div className="close" onClick={()=>dispatch(removeActiveFrame(iter_frame))}>
            {'\u2715'}
            </div>
        </div>
        
    )
}

export default DataTile
