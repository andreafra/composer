import React, { useState } from 'react'
import './style.css'

import Timeline, {TimelineCallbackData}  from 'components/actuators/Timeline'
import Frame from 'components/actuators/Editor/frame'
import { EditorOptions } from 'components/App/editorOptions'

export interface Channel {
  name: string
  pins: number[]
  frames: Frame[]
}

type EditorProps = {
  options: EditorOptions
  newTimelineCallback: Function
  newFrameCallback: Function
  editFrameCallback: Function
}

function Editor(props: EditorProps){
  // Temporary data structure: it will have to be passed upwards
  const [data, setData]: [Channel[], any] = useState([
    /* Mock for testing - TODO: REMOVE */
    {name:"Test: 1 Rect", pins: [1], frames: [{color: "red", start: 1, end: 2}]},
    {name:"Test: 2 Rect", pins: [2], frames: [
      {color: "green", start: 1, end: 2},
      {color: "purple", start: 4, end: 5},
    ]},
    {name:"Test: No Rect", pins: [], frames: []}
  ])

  const timelines = data.map((channel: Channel, index: number) =>
    <Timeline
      key={channel.name + index}
      index={index}
      options={props.options}
      name={channel.name}
      pins={channel.pins}
      frames={channel.frames}
      update={(data: TimelineCallbackData) => handleTimelineUpdate(data)}
      newFrameCallback={props.newFrameCallback}
      editFrameCallback={(frame: Frame) => props.editFrameCallback(frame)}
    />
  )

  /**
   * Receive new data from timeline and updates the data structure in editor.
   * Called when props.update(...) is called in a child component.
   * @param _data the callback data
   */
  const handleTimelineUpdate = (_data: TimelineCallbackData) => {
    // Create a new copy to edit (data is read-only)
    let newData = data.slice(0)
    // TODO: Update the editor
  }

  /**
   * On click, this function is used to call a custom callback that will have
   * to return user-input data as a Channel.
   * @param newTimelineCallback A function that must return a Channel
   */
  const handleNewTimelineBtn = () => {
    let newData = data.slice(0)
    newData.push(props.newTimelineCallback())
    setData(newData)
  }

  return (
    <div
      className="Editor"
    >
      <div className="Editor-timelines">
        {timelines}
      </div>
      <div className="Editor-toolbar">
        <button
          className="Editor-btn"
          onClick={handleNewTimelineBtn}
        >
          New timeline
        </button>
      </div>
    </div>
  )
}

export default Editor
