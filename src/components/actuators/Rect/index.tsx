import React, {useState, useEffect} from 'react'
import './style.css'
import Frame from '../Editor/frame'

interface RectStyle {
  backgroundColor: string
  width: string
  marginLeft: string
  zIndex: number
}

export interface RectCallbackData {
  index: number
  frame: Frame
}

type RectProps = {
  x: number
  index: number
  frame: Frame
  frameSize: number
  leftPadding: number
  shouldEdit: boolean
  update: Function
  editFrameCallback: Function
}

function Rect(props: RectProps){

  const [lastFrameStartX, setLastFrameStartX]: [number, any] = useState(props.frame.start * props.frameSize)
  const [lastFrameWidth, setLastFrameWidth]: [number, any] = useState((props.frame.end - props.frame.start + 1) * props.frameSize)
  // True if I'm editing this rectangle
  const [isActive, setIsActive] = useState(false)
  // Am I dragging the left or right handle?
  const [isLeftHandleActive, setIsLeftHandleActive] = useState(false)
  const [isRightHandleActive, setIsRightHandleActive] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)

  const lastFrameEndX: number = lastFrameStartX + lastFrameWidth

  const style: RectStyle = {
    backgroundColor: props.frame.color,
    width: lastFrameWidth + "px",
    marginLeft: lastFrameStartX + "px",
    zIndex: isActive ? 10000 : 0
  }

  const handleResize = () => {
    if(props.shouldEdit && isActive) {
      // If I'm editing the rectangle
      let newWidth: number = lastFrameWidth
      let newMargin: number = lastFrameStartX

      if(isLeftHandleActive) {
        newMargin = props.x - props.frameSize
        newWidth = lastFrameEndX - newMargin
      } else if(isRightHandleActive) {
        newWidth = props.x - lastFrameStartX - props.frameSize
        newMargin = lastFrameStartX
      } else {
        // drag the Rect around (it just works)
        newMargin = props.x - dragOffset - props.frameSize
      }

      setLastFrameWidth(newWidth >= props.frameSize ? newWidth : props.frameSize)
      setLastFrameStartX(newMargin)
    }
  }

  const fitToTimeline = () => {
    if(props.shouldEdit === false) {
      // If we were editing stuff, we want to finalize the changes and round the
      // rectangles to the correct position.
      if(isActive) {
        // how many frames the rect spans through.
        // Example: this Rect is long 3 frames.
        let sizeInFrames: number = Math.floor(lastFrameWidth / props.frameSize)
        let newWidth = props.frameSize * sizeInFrames
        if (lastFrameWidth % props.frameSize > props.frameSize * 0.5) {
          // Then I'm in the next frame (I add a frame)
          newWidth += props.frameSize
          sizeInFrames += 1
        }

        let marginInFrames: number = Math.floor(lastFrameStartX / props.frameSize)
        let newMargin = props.frameSize * marginInFrames
        if (lastFrameStartX % props.frameSize > props.frameSize * 0.5) {
          // Then I'm in the next frame (I add a frame)
          newMargin += props.frameSize
          marginInFrames += 1
        }
        // Handle mouse up
        setLastFrameStartX(newMargin)
        setLastFrameWidth(newWidth)
        
        // deep clone
        const frameCopy: Frame = JSON.parse(JSON.stringify(props.frame))
        frameCopy.start = marginInFrames
        frameCopy.end = marginInFrames + sizeInFrames - 1
        // push the data up to the parent
        const callbackData: RectCallbackData = {
          index: props.index,
          frame: frameCopy
        }
        props.update(callbackData)
      }
      setIsActive(false)
      setIsLeftHandleActive(false)
      setIsRightHandleActive(false)
    }
  }

  useEffect(() => handleResize(), [props.x])
  useEffect(() => fitToTimeline(), [props.shouldEdit])

  const handleEditFrame = () => {
    // deep clone
    const frameCopy: Frame = JSON.parse(JSON.stringify(props.frame))
    // push the data up to the parent
    const callbackData: RectCallbackData = {
      index: props.index,
      frame: props.editFrameCallback(frameCopy)
    }
    props.update(callbackData)
  }

  return (
    <div
      className="Rect"
      draggable={false}
      style={style}
      onDoubleClick={handleEditFrame}
      onMouseDown={(e) => {
        setIsActive(true)
        setDragOffset(e.pageX - (lastFrameStartX + props.leftPadding))
      }}
    >
      <div 
        className="Rect-left"
        draggable={false}
        onMouseDown={() => setIsLeftHandleActive(true)}
      ></div>
      <div 
        className="Rect-right"
        draggable={false}
        onMouseDown={() => setIsRightHandleActive(true)}
      ></div>
    </div>
  )
}

export default Rect
