import React from 'react'


const Variable = ({variable, value, handleValueChange}) => {
    return(
        <div className='Variable'>
            <label>{variable + ': '}</label>
            <input type='text' defaultValue={value} onChange={(event)=>handleValueChange(event.target.value)}></input>
            <br />
        </div>
    )
}

export default Variable