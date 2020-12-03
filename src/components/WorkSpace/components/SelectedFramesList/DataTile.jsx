import React from 'react'
import { removeActiveFrame, setFocus } from '../../../../actions'
import { useDispatch } from 'react-redux'
import './DataTile.css'
import { SERVER_IP_IMG } from '../../../../api'


const prepareImgUrl = (data_frame) => {
    let url = ''
    try{
        url = data_frame.data.results.simpleSubtraction.value
        url = SERVER_IP_IMG + url
    }
    catch(e)
    {
        url = SERVER_IP_IMG + '/static/DataBrowse/img/no_img.png'
    }
    return(url)
}

const DataTile = ({ data_frame }) => {
    const dispatch = useDispatch()
    
    return(
        <div className="DataTile" 
             focussed={data_frame.focussed.toString()} >
            <div className="TileContent" onClick={()=>dispatch(setFocus(data_frame))}>
                <img className="TileImage" src={prepareImgUrl(data_frame)}
                    height={70}
                    width={70}/>
                {data_frame.data.name + ' ' + ' (ID: ' + data_frame.id + ')'}
            </div>
            
            <div className="close" onClick={()=>dispatch(removeActiveFrame(data_frame))}>
            {'\u2715'}
            </div>
        </div>
        
    )
}

export default DataTile
