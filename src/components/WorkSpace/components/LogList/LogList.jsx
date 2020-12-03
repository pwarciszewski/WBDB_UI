import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import './LogList.css'

const LogList = () => {
    const logs = useSelector(state => state.loglist)
    const ref = React.createRef()
    useEffect(()=>{ref.current.scrollTop = ref.current.scrollHeight})
    return(
        <div className='Console' ref={ref}>
            <ul>
                {logs.map((log, index) => (<li key={log + index}>{log}</li>))}
            </ul>
        </div>
    )
}

export default LogList