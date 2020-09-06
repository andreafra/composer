import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFrame } from 'store/actions'
import { ComposerState, Frame } from 'types'
import { LEFT_PADDING } from 'utils/constants'
import './style.css'

interface RectStyle {
  backgroundColor: string
  width: string
  marginLeft: string
  zIndex: number
}

type RectProps = {
  x: number
  frame: Frame
  fields: JSX.Element[] | null
  shouldEdit: boolean
  onDoubleClick: (id: string) => void
}

function Rect(props: RectProps){
  const dispatch = useDispatch()
  const options = useSelector((state: ComposerState) => state.system.editorOptions)

  const [frameStartX, setFrameStartX]: [number, any] = useState(props.frame.start * options.frameSize)
  const [FrameWidth, setFrameWidth]: [number, any] = useState((props.frame.end - props.frame.start + 1) * options.frameSize)
  // True if I'm editing this rectangle
  const [isActive, setIsActive] = useState(false)
  // Am I dragging the left or right handle?
  const [isLeftHandleActive, setIsLeftHandleActive] = useState(false)
  const [isRightHandleActive, setIsRightHandleActive] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)

  const frameEndX: number = frameStartX + FrameWidth

  const style: RectStyle = {
    backgroundColor: props.frame.color,
    width: FrameWidth + "px",
    marginLeft: frameStartX + "px",
    zIndex: isActive ? 10000 : 0
  }

  const handleResize = () => {
    if(props.shouldEdit && isActive) {
      // If I'm editing the rectangle
      let newWidth: number = FrameWidth
      let newMargin: number = frameStartX

      if(isLeftHandleActive) { // Drag left handle
        newMargin = props.x - LEFT_PADDING // - options.frameSize
        newWidth = frameEndX - newMargin
        if (props.x <= LEFT_PADDING){
          newMargin = 0 
          newWidth = FrameWidth + frameStartX
        }
      } else if(isRightHandleActive) { // Drag right handle
        newWidth = props.x - frameStartX - LEFT_PADDING //- options.frameSize
        newMargin = frameStartX
        if(props.x >= options.width){
          newWidth = (options.width - frameStartX)
        }
      } else { // drag the Rect around (it just works)
        newWidth = FrameWidth
        if(props.x - dragOffset <= LEFT_PADDING) { // Stop at left margin
          newMargin = 0 
        } else if(props.x + (FrameWidth - dragOffset) >= options.width + LEFT_PADDING) { // Stop at right margin
          newMargin = options.width - FrameWidth
        } else {
          newMargin = props.x - dragOffset - options.frameSize
        }
      }
     
      setFrameWidth(newWidth >= options.frameSize ? newWidth : options.frameSize)
      setFrameStartX(newMargin)
    }
  }

  const fitToTimeline = () => {
    if(props.shouldEdit === false) {
      // If we were editing stuff, we want to finalize the changes and round the
      // rectangles to the correct position.
      if(isActive) {
        // how many frames the rect spans through.
        // Example: this Rect is long 3 frames.
        let sizeInFrames: number = Math.floor(FrameWidth / options.frameSize)
        let newWidth = options.frameSize * sizeInFrames
        if (FrameWidth % options.frameSize > options.frameSize * 0.5) {
          // Then I'm in the next frame (I add a frame)
          newWidth += options.frameSize
          sizeInFrames += 1
        }

        let marginInFrames: number = Math.floor(frameStartX / options.frameSize)
        let newMargin = options.frameSize * marginInFrames
        if (frameStartX % options.frameSize > options.frameSize * 0.5) {
          // Then I'm in the next frame (I add a frame)
          newMargin += options.frameSize
          marginInFrames += 1
        }
        // Handle mouse up
        setFrameStartX(newMargin)
        setFrameWidth(newWidth)
        
        // deep clone
        const frameCopy: Frame = JSON.parse(JSON.stringify(props.frame))
        frameCopy.start = marginInFrames
        frameCopy.end = marginInFrames + sizeInFrames - 1
        dispatch(setFrame(frameCopy, frameCopy.id, frameCopy.channelId))
      }
      setIsActive(false)
      setIsLeftHandleActive(false)
      setIsRightHandleActive(false)
    }
  }

  useEffect(() => handleResize(), [props.x])
  useEffect(() => fitToTimeline(), [props.shouldEdit])
  // Update from outside
  useEffect(() => {
    setFrameStartX(props.frame.start * options.frameSize)
    setFrameWidth((props.frame.end - props.frame.start + 1) * options.frameSize)
  }, [props.frame.start, props.frame.end, options.frameSize])

  const _handleEditFrame = () => {
    props.onDoubleClick(props.frame.id)
  }

  return (
    <div
      className="Rect"
      draggable={false}
      style={style}
      onDoubleClick={_handleEditFrame}
      onMouseDown={(e) => {
        setIsActive(true)
        setDragOffset(e.pageX - (frameStartX + LEFT_PADDING))
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
      <div className="Rect-content">
        {props.fields}
      </div>
    </div>
  )
}

export default Rect
