import React from 'react'
import { useSelector } from 'react-redux'
import { SERVER_IP } from '../../../../api'
import './FileDownloader.css'

const FileDownloader = () => {
    const active_frames = useSelector(state => state.activeframes)

    const extractIds = (acc, cur) => {
        let temp_list = []
        const data_frames = cur.data_frames
        if(data_frames !== undefined) {
            for(const frame of data_frames){
                temp_list.push(frame.id)
            }
        }
        return(acc.concat(temp_list))
    }

    const frames_ids = active_frames.reduce((acc, cur) => extractIds(acc, cur), [])

    const handleSubmitCommand = (e) => {
        const r = window.confirm('Zipping files might take a while. Click OK to proceed')
        if(!r){
            e.preventDefault();
        }
    }

    return(
        <div className='FileDownloader'>
            <form action={SERVER_IP + '/download/'} method="post" id="formdownload" onSubmit={(e) => handleSubmitCommand(e)}>
                <input id="container_for_ids" type="hidden" name="ids" value={[JSON.stringify(frames_ids)]} />
                <button type='submit'>Download</button>
            </form>
        </div>
    )

}

export default FileDownloader