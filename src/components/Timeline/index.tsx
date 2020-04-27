import React, { useState } from 'react'
import './style.css'

import Rect, { RectCallbackData } from 'components/Rect'

export interface Frame {
  color: string
  start: number
  end: number
}

export interface TimelineCallbackData {
  timelineIndex: number
  timeline: Frame[]
}

function Timeline(props: any) {

  const [mouseX, setMouseX] = useState(0)
  const [isMouseDown, setIsMouseDown] = useState(false)

  const onMouseMove = (e: any) => {
    if(isMouseDown) {
      setMouseX(e.pageX)
    }
  }
  
  const handleRectUpdate = (data: RectCallbackData) => {
    // Should the Rect have a UID

    // HANDLE THE OVERLAPPING RECTS
    // props.frames[data.id] is the Rect that has been edited
    // TODO: when a rect is done resizing, do the following steps:
    // 1. Gracefully handle overlapping Rects
    // 2. Sort the timeline data structure
    // 3. Push the timeline data to the Editor
  }

  const rects = props.frames.map((frame: Frame, index: number) => (
    <Rect
      key={index}
      id={index}
      x={mouseX}
      shouldEdit={isMouseDown}
      frameSize={props.options.frameSize}
      frameStart={frame.start}
      frameEnd={frame.end}
      leftPadding={props.options.leftPadding}
      color={frame.color}
      update={(data: RectCallbackData) => handleRectUpdate(data)}
    />
  ))

  return (
    <div
      className="Timeline"
      onMouseMove={e => onMouseMove(e)}
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
      style={{
        marginLeft: props.options.leftPadding,
        width: props.options.width
      }}
    >
      <h3 className="Timeline-title">{props.name || "Unnamed timeline"}</h3>
      <div className="Timeline-frames">
        {rects}
      </div>
    </div>
  )
}

export default Timeline
