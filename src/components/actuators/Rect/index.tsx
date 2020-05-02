import React, {useState, useEffect } from 'react'
import './style.css'
import { Frame, ComposerState } from 'types'
import { useSelector } from 'react-redux'

interface RectStyle {
  backgroundColor: string
  width: string
  marginLeft: string
  zIndex: number
}

type RectProps = {
  x: number
  frame: Frame
  shouldEdit: boolean
}

function Rect(props: RectProps){

  const options = useSelector((state: ComposerState) => state.system.editorOptions)

  const [lastFrameStartX, setLastFrameStartX]: [number, any] = useState(props.frame.start * options.frameSize)
  const [lastFrameWidth, setLastFrameWidth]: [number, any] = useState((props.frame.end - props.frame.start + 1) * options.frameSize)
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
        newMargin = props.x - options.frameSize
        newWidth = lastFrameEndX - newMargin
      } else if(isRightHandleActive) {
        newWidth = props.x - lastFrameStartX - options.frameSize
        newMargin = lastFrameStartX
      } else {
        // drag the Rect around (it just works)
        newMargin = props.x - dragOffset - options.frameSize
      }

      setLastFrameWidth(newWidth >= options.frameSize ? newWidth : options.frameSize)
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
        let sizeInFrames: number = Math.floor(lastFrameWidth / options.frameSize)
        let newWidth = options.frameSize * sizeInFrames
        if (lastFrameWidth % options.frameSize > options.frameSize * 0.5) {
          // Then I'm in the next frame (I add a frame)
          newWidth += options.frameSize
          sizeInFrames += 1
        }

        let marginInFrames: number = Math.floor(lastFrameStartX / options.frameSize)
        let newMargin = options.frameSize * marginInFrames
        if (lastFrameStartX % options.frameSize > options.frameSize * 0.5) {
          // Then I'm in the next frame (I add a frame)
          newMargin += options.frameSize
          marginInFrames += 1
        }
        // Handle mouse up
        setLastFrameStartX(newMargin)
        setLastFrameWidth(newWidth)
        
        // deep clone
        const frameCopy: Frame = JSON.parse(JSON.stringify(props.frame))
        frameCopy.start = marginInFrames
        frameCopy.end = marginInFrames + sizeInFrames - 1
        // TODO: push the data up to the parent
        // const callbackData: RectCallbackData = {
        //   index: props.index,
        //   frame: frameCopy
        // }
        // props.update(callbackData)
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
    // TODO: push the data up to the parent
    // const callbackData: RectCallbackData = {
    //   index: props.index,
    //   frame: props.editFrameCallback(frameCopy)
    // }
    // props.update(callbackData)
  }

  return (
    <div
      className="Rect"
      draggable={false}
      style={style}
      onDoubleClick={handleEditFrame}
      onMouseDown={(e) => {
        setIsActive(true)
        setDragOffset(e.pageX - (lastFrameStartX + options.leftPadding))
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
