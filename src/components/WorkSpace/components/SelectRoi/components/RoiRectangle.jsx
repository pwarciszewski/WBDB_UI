import React from 'react'
import { Rnd } from 'react-rnd'


const RoiRectangle = ({ placement, id, onDrag, onResize }) => {
    return(
        <Rnd
          position={{x:placement.x, y:placement.y}}
          size={{width: placement.width, height: placement.height}}
          title = {id}
          bounds='.SelectedImageRoi'
          onDragStop={(_, data)=>{onDrag(id, data.x, data.y)}}
          onResizeStop={(e, direction, ref, delta, position)=>{onResize(id, position.x, position.y, ref.offsetWidth, ref.offsetHeight)}}>
        <div className='Rectangle'></div>
        </Rnd>
    )
}

export default RoiRectangle