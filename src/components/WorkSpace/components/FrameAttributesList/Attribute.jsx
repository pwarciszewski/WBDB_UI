import React from 'react'

const renderCell = (obj) => {
    if(obj !== undefined){
        return(<td>{obj}</td>)
    }
    else
        return('')
}

const Attribute = ({props}) => {
    return(
        <tr>
            {renderCell(props.name)}
            {renderCell(props.type)}
            {renderCell(props.value)}
        </tr>
    )
}

export default Attribute