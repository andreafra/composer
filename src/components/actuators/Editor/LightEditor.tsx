import React from 'react'
import './style.css'
import Editor, { Channel } from '../Editor/index'
import Frame from './frame'

function LightEditor(props: any) {


  const createTimeline = () : Channel => {
    let newChannel: Channel = {
      name: "Channel1",
      pins: [],
      frames: []
    }
    return newChannel
  }

  const createFrame = () : Frame => {
    let newFrame: LightFrame = {
      color: "red",
      start: 0,
      end: 1,
      lightColor: "red"
    }
    return newFrame
  }

  const editFrame = (frame: Frame) : Frame => {
    // Cast frame to specific implementation
    let _frame = frame as LightFrame
    _frame.color = "blue"
    _frame.lightColor = "blue"
    
    return _frame
  }

  return (
    <Editor
      options={props.options}
      newTimelineCallback={createTimeline}
      newFrameCallback={createFrame}
      editFrameCallback={(frame: Frame) => editFrame(frame)}
    />
  )
}

export default LightEditor
