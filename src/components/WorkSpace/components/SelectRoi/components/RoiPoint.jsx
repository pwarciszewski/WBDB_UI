import React from 'react'
import { Rnd } from 'react-rnd'


const RoiPoint = ({ placement, id, onDrag}) => {
    return(
        <Rnd
          position={{x:placement.x, y:placement.y}}
          size={{width: 20, height: 20}}
          title = {id}
          enableResizing = {false}
          bounds='.SelectedImageRoi'
          onDragStop={(_, data)=>{onDrag(id, data.x, data.y)}}>
        <div className='Point'>{'\u2715'}</div>
        </Rnd>
    )
}

export default RoiPoint