import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getNewestID, fetchData } from '../../../../api'
import { addActiveFrame, addLog } from '../../../../actions'
import './NewDataWatcher.css'

const NewDataWatcher = () => {
    const dispatch = useDispatch()
    const [last_newest_id, setLastId] = useState(0)
    const [checked, toggleChecked] = useState(false)
    const [newest_id, setNewNewestId] = useState(0)

    function handleChange() {
        if(!checked) {
            dispatch(addLog("Watching for new frames..."))
            getNewestID(new_id => {setNewNewestId(new_id)
                                   setLastId(new_id)})
        }
        toggleChecked(!checked)
    }

    function addNewFrame (checked, newest_id, last_newest_id) {
        // this function operates under an assumption that data frames are stored on the server with ids
        // represented as following integers. It means for example that when newest_id is 5, and 
        // last_newest_id is 3 the UI has to ask for frames with id 4 and id 5 to get all new data
        if(checked) {
            getNewestID(new_id => {setNewNewestId(new_id)})
            if(last_newest_id !== newest_id) {
                dispatch(addLog('Detected new frame(s)!'))
                var requested_ids = []
                for(var i = last_newest_id + 1; i <= newest_id; i++) {
                    requested_ids.push(i)
                }
                setLastId(newest_id)
                fetchData(data => {dispatch(addActiveFrame(data))}, [newest_id])
            }
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
          addNewFrame(checked, newest_id, last_newest_id)
        }, 1000)
        return () => clearInterval(interval)
      }, [checked, newest_id, last_newest_id])

    return(
        <div className="NewDataWatcher" active={checked.toString()} onClick={()=>handleChange()}>
            <div className='displaytext'>
                Loading new frames: {String(checked)}
            </div>
        </div>
    )
}

export default NewDataWatcher