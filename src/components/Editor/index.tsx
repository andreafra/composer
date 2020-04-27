import React, { useState } from 'react'
import './style.css'

import Timeline, {Frame, TimelineCallbackData}  from 'components/Timeline'

export interface Channel {
  name: string
  pins: number[]
  frames: Frame[]
}

function Editor(props: any){
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
      options={props.options}
      name={channel.name}
      pins={channel.pins}
      frames={channel.frames}
      update={(data: TimelineCallbackData) => handleTimelineUpdate(data)}
    />
  )

  const handleTimelineUpdate = (_data: TimelineCallbackData) => {
    // Create a new copy to edit (lightData is read-only)
    let newLightData = data.slice(0)
    // TODO: Update the editor
  }

  return (
    <div
      className="Editor"
    >
      {timelines}
    </div>
  )
}

export default Editor
