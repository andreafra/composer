import React, { useState, useEffect } from 'react'
import './style.css'

import Rect from 'components/Rect'

function Timeline(props: any) {

  const [mouseX, setMouseX] = useState(0)
  const [isMouseDown, setIsMouseDown] = useState(false)

  // TODO: should updated ALSO on mouse down
  const onMouseMove = (e: any) => {
    if(isMouseDown) {
      setMouseX(e.pageX)
    }
  }


  // TODO: resolve mock components

  return (
    <div
      className="Timeline"
      onMouseMove={e => onMouseMove(e)}
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
      style={{marginLeft: props.options.leftPadding}}
    >
      <Rect
        x={mouseX}
        shouldEdit={isMouseDown}
        frameSize={props.options.frameSize}
        frameStart={1}
        frameEnd={1}
        leftPadding={props.options.leftPadding}
        color={"red"}
        update={(data: any) => { /* callback */}}
      />
    </div>
  )
}

export default Timeline
