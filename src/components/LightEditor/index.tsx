import React from 'react'
import './style.css'

import LightTimeline from 'components/LightTimeline'

function LightEditor(props: any){

  

  let editorStyle = {
    width: props.editorWidth + "px",
    marginLeft: props.editorLeftPadding + "px",
    backgroundColor: "pink"
  }

  return (
    <div
      className="LightEditor"
      style={editorStyle}
    >
      <LightTimeline
        resolution={props.editorResolution}
        editorLeftPadding={props.editorLeftPadding}
        editorFrameSize={props.editorFrameSize}
      />
    </div>
  )
}

export default LightEditor