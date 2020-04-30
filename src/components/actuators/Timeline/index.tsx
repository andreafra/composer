import React, { useState } from 'react'
import './style.css'

import Rect, { RectCallbackData } from 'components/actuators/Rect'
import Frame from 'components/actuators/Editor/frame'
import { EditorOptions } from 'components/App/editorOptions'

type TimelineProps = {
  index: number
  options: EditorOptions
  name: string
  pins: Array<number>
  frames: Array<Frame>
  update: Function
  newFrameCallback: Function
  editFrameCallback: Function
}

function Timeline(props: TimelineProps) {

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
    // data.frame is the new frame
    // One possible implementation might be to delete the index-esim
    // frame/rect, and replace it with the new one (data.frame)
    // TODO: when a rect is done resizing, do the following steps:
    // 1. Gracefully handle overlapping Rects
    // 2. Sort the timeline data structure
    // 3. Push the timeline data to the Editor
  }

  const rects = props.frames.map((frame: Frame, index: number) => (
    <Rect
      key={index}
      index={index}
      x={mouseX}
      shouldEdit={isMouseDown}
      frameSize={props.options.frameSize}
      frame={frame}
      leftPadding={props.options.leftPadding}
      update={(data: RectCallbackData) => handleRectUpdate(data)}
      editFrameCallback={(frame: Frame) => props.editFrameCallback(frame)}
    />
  ))

  /**
   * This function accepts a function as parameter that has to return
   * a Frame, and then updates the data structure.
   * Use a UI to retrieve user-input and convert it to a Frame.
   * @param newFrameCallback a function that returns a frame
   */
  const handleNewFrameBtn = () => {
    let newTimeline = props.frames
    newTimeline.push(props.newFrameCallback())
    const newTimelineCallbackData: TimelineCallbackData = {
      index: props.index,
      frames: newTimeline
    }
    props.update(newTimelineCallbackData)
  }

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
      <div className="Timeline-toolbox">
        <h3 className="Timeline-title">{props.name || "Unnamed timeline"}</h3>
        <button
          className="Timeline-btn"
          onMouseDown={handleNewFrameBtn}
        >
          Add frame
        </button>
      </div>
      <div className="Timeline-frames">
        {rects}
      </div>
    </div>
  )
}

export default Timeline
