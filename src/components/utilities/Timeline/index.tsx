import { getTheme } from '@fluentui/react'
import { CurrentInstantMarkerCtx } from 'components/App'
import { ScrollContext } from 'components/utilities/ScrollableDiv'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { ComposerState, Point } from 'types'
import { ACCENT_COLOR_ALT, LEFT_PADDING } from 'utils/constants'
import './style.css'

// Canvas ref, module-scoped so it doesn't get resetted.
let rect: DOMRect | null

/**
 * This component builds a canvas with the lines for actual melody composition.
 * @param props notes, melody, update (callback)
 * @return JSX Canvas element
 */
function Timeline() {

  const theme = getTheme()

  const scrollCtx = useContext(ScrollContext)
  const currentInstantCtx = useContext(CurrentInstantMarkerCtx)

  const options = useSelector((state: ComposerState) => state.system.editorOptions)

  const TIMELINE_W = options.width + LEFT_PADDING
  const CELL_W = options.frameSize
  const TIMELINE_H = 30

  const timelineCanvasRef = useRef<HTMLCanvasElement>(null)

  const [isDragging, setIsDragging]: [boolean, any] = useState(false)

  /**
   * Actions to do when you start holding down mouseclick on the canvas.
   */
  const onInputStart = (e: any) => {
    setIsDragging(true)
    doInputAction(e)
  }

  /**
   * Actions to do when you stop holding down mouseclick on the canvas.
   */
  const onInputStop = () => {
    setIsDragging(false)
  }

  /**
   * Handle the input movement when you press down on the canvas and move the
   * cursor.
   * @param e Event
   */
  const onInputMove = (e: any) => {
    if (isDragging) doInputAction(e)
  }

  const doInputAction = (e: any) => {
    let pos = getInputPos(e)
    if (pos.x > LEFT_PADDING) {
      let frameIndex = getFrameIndex(pos)
      currentInstantCtx.changeValue(frameIndex)
    }
  }

  /**
   * Get mouse relative position to canvas
   * @returns a Point object
   * @param e The event of a mouse interaction
   */
  const getInputPos = (e: any): Point => {
    if (rect) return {
      x: e.clientX + scrollCtx.scroll, // - rect.left,
      y: e.clientY - rect.top
    }
    return { x: -1, y: -1 }
  }

  /**
   * Pass a mouse position and get the frame index.
   * @returns the frame index
   * @param position A position on the canvas
   */
  const getFrameIndex = (position: Point): number => {
    return Math.floor((position.x - LEFT_PADDING) / CELL_W) + 1
  }

  useEffect(() => {
    let timeline = timelineCanvasRef.current
    if (timeline) {
      // Init canvas space
      let ctx = timeline.getContext('2d')
      rect = timeline.getBoundingClientRect()

      // Draw lines
      let smallColumns = TIMELINE_W / (CELL_W);
      let columns = TIMELINE_W / (CELL_W * 4);
      if (ctx) {
        ctx.clearRect(0, 0, TIMELINE_W, TIMELINE_H);

        for (let index = 0; index < smallColumns; index++) {
          ctx.strokeStyle = ACCENT_COLOR_ALT
          ctx.lineWidth = 0.3
          ctx.beginPath()
          ctx.moveTo(LEFT_PADDING + CELL_W * index, TIMELINE_H / 2)
          ctx.lineTo(LEFT_PADDING + CELL_W * index, TIMELINE_H)
          ctx.closePath()
          ctx.stroke()
        }

        for (let index = 0; index < columns; index++) {
          ctx.strokeStyle = ACCENT_COLOR_ALT
          ctx.lineWidth = 0.3
          ctx.beginPath()
          ctx.moveTo(LEFT_PADDING + CELL_W * 4 * index, 0)
          ctx.lineTo(LEFT_PADDING + CELL_W * 4 * index, TIMELINE_H)
          ctx.closePath()
          ctx.stroke()

          ctx.font = `12px sans-serif`
          ctx.fillStyle = ACCENT_COLOR_ALT
          ctx.fillText(`${index * options.resolution * 4}ms`, LEFT_PADDING + CELL_W * 4 * index + 5, 12)

          let triangleCenter = LEFT_PADDING + (currentInstantCtx.value - 1) * options.frameSize
          if (triangleCenter < LEFT_PADDING)
            triangleCenter = LEFT_PADDING

          ctx.fillStyle = theme.palette.accent
          ctx.beginPath()
          ctx.moveTo(triangleCenter - 5, TIMELINE_H / 2)
          ctx.lineTo(triangleCenter, TIMELINE_H)
          ctx.lineTo(triangleCenter + 5, TIMELINE_H / 2)
          ctx.lineTo(triangleCenter - 5, TIMELINE_H / 2)
          ctx.closePath()
          ctx.fill()
        }
      }
    }
  })

  return (
    <div className="Timeline">
      <canvas
        className="Timeline-canvas"
        ref={timelineCanvasRef}
        width={TIMELINE_W}
        height={TIMELINE_H}
        onMouseDown={onInputStart}
        onMouseLeave={onInputStop}
        onMouseUp={onInputStop}
        onMouseMove={onInputMove}
      ></canvas>
    </div>
  )
}

export default Timeline
