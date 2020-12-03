import React from 'react'
import { useSelector } from 'react-redux'
import { SERVER_IP } from '../../../../api'
import './FileDownloader.css'

const FileDownloader = () => {
    const active_frames = useSelector(state => state.activeframes)
    const frames_ids = active_frames.map(function(frame) {
        return frame.id
    })

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