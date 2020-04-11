import React from 'react'
import './style.css'

import LightTimeline from 'components/LightTimeline'

function LightEditor(props: any){
  const editorStyle = {
    width: props.options.width + "px",
    marginLeft: props.options.leftPadding + "px",
  }

  return (
    <div
      className="LightEditor"
      style={editorStyle}
    >
      <LightTimeline
        options={props.options}
      />
    </div>
  )
}

export default LightEditor