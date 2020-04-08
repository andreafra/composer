import React, { useRef, useEffect, useState } from 'react'
import './style.css'

const canvasW = window.innerWidth
let canvasH = 0 // in px

let numberOfRows = 0

let cellSafeZoneX = 30

let cellW = 30
let cellH = 15

let ctx: CanvasRenderingContext2D | null
let rect: DOMRect | null

interface Frame {
  note: Note,
  pitch: number,
  volume: number,
  time: number,
  type: OscillatorType
}

interface Note {
  name: string
  freq: number
  octave: number
}

interface Point {
  x: number,
  y: number
}

/**
 * This component builds a canvas with the lines for actual melody composition.
 * @param props notes, melody, update (callback)
 * @return JSX Canvas element
 */
function SoundTimeline(props: any) {

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [lastCell, setLastCell]: [Point, any] = useState({ x: 0, y: 0 })
  const [isDrawing, setIsDrawing]: [boolean, any] = useState(false)

  /**
   * This part renders the canvas after initialising it.
   */
  useEffect(() => {
    let canvas = canvasRef.current
    if (canvas) {
      // Init canvas space
      ctx = canvas.getContext('2d')
      rect = canvas.getBoundingClientRect()
      // Calculate number of rows
      numberOfRows = props.notes.length

      // Make canvas height match number of rows
      canvasH = numberOfRows * cellH
      canvas.height = canvasH

      // Render "loop"
      drawBackground()
      drawLines(numberOfRows)
      drawLabels(props.notes)
      drawNotes(props.melody)
    }
  })

  /**
   * Send new note up to parent component
   * @param row The y position of the note
   * @param time The x position of the note
   * @param type The instrument used
   */
  const addNote = (time: number, row: number, type: OscillatorType) => {
    // update parent component
    props.update({
      data: props.notes[row],
      time: time,
      type: type,
      pitch: row
    })
  }

  /**
   * Delete note by sending its position up to parent component
   * @param time The x position of the note
   */
  const deleteNote = (time: number) => {
    // update parent component
    props.delete({
      time: time,
    })
  }

  /**
   * Actions to do when you start holding down mouseclick on the canvas.
   */
  const onInputStart = (e: any) => {
    setIsDrawing(true)
    doInputAction(e)
  }

  /**
   * Actions to do when you stop holding down mouseclick on the canvas.
   */
  const onInputStop = () => {
    setIsDrawing(false)
    // Pass an "invalid" cell to never trigger the check
    setLastCell({x: -1, y: -1})
  }

  /**
   * Handle the input movement when you press down on the canvas and move the
   * cursor.
   * @param e Event
   */
  const onInputMove = (e: any) => {
    if (isDrawing) doInputAction(e)
  }

  const doInputAction = (e: any) => {
    let pos = getInputPos(e)
    if (pos.x > cellSafeZoneX) {
      let cell = getCell(pos)
      // when I change cell...
      // optimized: only when cell changes
      if (lastCell.x !== cell.x || lastCell.y !== cell.y) {
        setLastCell(cell)
        if (e.ctrlKey) {
          deleteNote(cell.x - 1)
        } else {
          // Pass note to data structure
          addNote(cell.x - 1, cell.y, "sine")
        }
      }
    }
  }

  /**
   * Get mouse relative position to canvas
   * @returns a Point object
   * @param e The event of a mouse interaction
   */
  const getInputPos = (e: any): Point => {
    if (rect) return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
    return { x: -1, y: -1 }
  }

  /**
   * Pass a mouse position and get the cell in simplified X and Y
   * coordinates that contains it.
   * @returns a point corresponding to the coordinates of the cell
   * @param position A position on the canvas
   */
  const getCell = (position: Point): Point => {
    return {
      x: Math.floor(position.x / cellW),
      y: Math.floor(position.y / cellH)
    }
  }

  /**
   * Draws the background for the canvas
   */
  const drawBackground = () => {
    if (ctx) {
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, canvasW, canvasH)
    }
  }

  /**
   * Draw horizontal lines on the canvas
   * @param n Number of lines to draw
   */
  const drawLines = (n: number) => {
    if (ctx) {
      for (let i = 0; i <= n; i++) {
        // Get height of a row
        let marginTop = cellH * i

        ctx.strokeStyle = "red"
        ctx.lineWidth = 0.3
        ctx.beginPath()
        ctx.moveTo(0, marginTop)
        ctx.lineTo(canvasW, marginTop)
        ctx.closePath()
        ctx.stroke()

      }

      ctx.strokeStyle = "blue"
      ctx.beginPath()
      ctx.moveTo(cellW, 0)
      ctx.lineTo(cellW, canvasH)
      ctx.closePath()
      ctx.stroke()
    }
  }


  /**
   * Draws note name labels (A, A#, ...)
   * @param notes Pass the array of notes
   */
  const drawLabels = (notes: Note[]) => {
    if (ctx) {
      let marginTop = cellH
      ctx.font = `${cellH - 3}px sans-serif`
      ctx.fillStyle = "red"
      for (const note of notes) {
        ctx.fillText(note.name, 5, marginTop - 2)
        marginTop += cellH
      }
    }
  }

  /**
   * Draw a filled rectangle in the right position.
   * @param x The position of the x-esim cell
   * @param y The position of the y-esim cell
   * @param color Color of the rectangle
   */
  const drawRectangle = (x: number, y: number, color: string) => {
    if (ctx) {
      ctx.fillStyle = color
      ctx.fillRect(x * cellW, y * cellH, cellW, cellH)
    }
  }

  /**
   * Draws notes by color and position using their
   * pitch(y axis), time(x axis) and waveform(color)
   * @param melody Array of frames to render
   */
  const drawNotes = (melody: Frame[]) => {
    for (let index = 0; index < melody.length; index++) {
      const frame = melody[index]

      if (frame)
        drawRectangle(index + 1, frame.pitch, "red")
    }
  }

  return (
    <canvas
      className="soundCanvas"
      ref={canvasRef}
      width={canvasW}
      height={canvasH}
      onMouseMove={(e) => onInputMove(e)}
      onMouseDown={(e) => onInputStart(e)}
      onMouseUp={onInputStop}
      onMouseLeave={onInputStop}
    ></canvas>
  )
}

export default SoundTimeline