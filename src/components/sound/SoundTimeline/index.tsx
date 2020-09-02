import { ScrollContext } from 'components/utilities/ScrollableDiv'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeNote, setNote } from 'store/actions'
import { ComposerState, Note, Point, SoundFrame, InstrumentType } from 'types'
import { ACCENT_COLOR, ACCENT_COLOR_ALT, LEFT_PADDING } from 'utils/constants'
import { createNoteTable } from 'utils/SoundGenerator'
import './style.css'
import { SoundEditorOptionsCtx } from '../SoundEditor'
/*
 * Funny story time: stuff you declare outside a function component 
 * doesn't get resetted when React decides on its own to refresh that
 * component, so stuff that has to be instantiated only once, such as
 * a canvas ref, or a AudioContext/Oscillator it's in the global scope
 * of the file.
 */

// ===== Canvas ref =====
let ctx: CanvasRenderingContext2D | null
let rect: DOMRect | null
let CANVAS_H = 0 // in px
let numberOfRows = 0

// ===== Sound Generator =====
// let AudioContext = window.AudioContext
// let audioCtx = new AudioContext();

// // create Oscillator and gain node
// let oscillator = audioCtx.createOscillator()
// let gainNode = audioCtx.createGain()

// // connect oscillator to gain node to speakers
// oscillator.connect(gainNode)
// gainNode.connect(audioCtx.destination)

// // set default options
// oscillator.detune.value = 100 // value in cents, IDK what this does :)
// oscillator.frequency.value = 0 // pitch
// oscillator.type = "sine" // instrument
// gainNode.gain.value = 0 // volume
// oscillator.start(0) // start now

/**
 * This component builds a canvas with the lines for actual melody composition.
 * @param props notes, melody, update (callback)
 * @return JSX Canvas element
 */
function SoundTimeline() {

  const scrollCtx = useContext(ScrollContext)
  const soundEditorOptions = useContext(SoundEditorOptionsCtx)

  const dispatch = useDispatch()
  const options = useSelector((state: ComposerState) => state.system.editorOptions)
  const melody = useSelector((state: ComposerState) => state.sound)

  // Init notes frequencies
  // TODO: replace 3, 5 with actual parameters
  const notes = useMemo(() => createNoteTable(3, 5).reverse(), [])

  const CANVAS_W = options.width + LEFT_PADDING
  const CELL_W = options.frameSize
  const CELL_H = 15

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [lastCell, setLastCell]: [Point, any] = useState({ x: 0, y: 0 })
  const [isDrawing, setIsDrawing]: [boolean, any] = useState(false)

  const type = soundEditorOptions.instrumentType

  const MAX_VOLUME = 0.2

  /**
   * This part renders the canvas after initialising it.
   */
  useEffect(() => {
    let canvas = canvasRef.current
    // If canvas exists, update it
    if (canvas) {
      // Init canvas space
      ctx = canvas.getContext('2d')
      rect = canvas.getBoundingClientRect()
      // Calculate number of rows
      numberOfRows = notes.length

      // Make canvas height match number of rows
      CANVAS_H = numberOfRows * CELL_H
      canvas.height = CANVAS_H

      // Render "loop"
      drawBackground()
      drawRows(numberOfRows)
      drawLabels(notes)
      drawNotes(melody)
      drawColumns()
    }
  })

  /**
   * Send new note up to parent component
   * @param row The y position of the note
   * @param time The x position of the note
   * @param type The instrument used
   */
  const addNote = (time: number, row: number, type: InstrumentType) => {
    for (let i = melody.length; i < time; i++) {
      dispatch(removeNote(i))
    }
    // update parent component
    const _oldNote = melody[time]
    const _newNote: SoundFrame = {
      note: notes[row],
      type: type,
      pitch: row,
      volume: _oldNote?.volume || 0.5
    }
    dispatch(setNote(_newNote, time))
  }

  /**
   * Delete note by sending its position up to parent component
   * @param time The x position of the note
   */
  const deleteNote = (time: number) => {
    // update parent component
    dispatch(removeNote(time))
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
    
    // Stop playing sound
    // oscillator.frequency.value = 0 // pitch
    // gainNode.gain.value = 0 // volume
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
    if (pos.x > LEFT_PADDING) {
      let cell = getCell(pos)

      // ALWAYS: play sound preview
      // Update the frequency
      // oscillator.frequency.value = notes[cell.y] ? notes[cell.y].freq : 0// pitch

      // Update the instrument
      // Prevents the sine function from being "resetted/recentered",
      // which produces an annoying buzz, basically it's not "smooth"
      // if (type !== "sine")
      //   oscillator.type = type
      
      // Update the volume
      let frame = melody[cell.x - 1]
      let volume = 0.5 * MAX_VOLUME;
      if (frame && frame.volume) volume = frame.volume * MAX_VOLUME
      // gainNode.gain.value = volume // volume

      // when I change cell...
      // optimized: only when cell changes
      if (lastCell.x !== cell.x || lastCell.y !== cell.y) {
        setLastCell(cell)
        if (e.ctrlKey || soundEditorOptions.mouseMode === "erase") {
          deleteNote(cell.x - 1)
        } else if (soundEditorOptions.mouseMode === "draw") {
          // Pass note to data structure
          addNote(cell.x - 1, cell.y, type)
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
      x: e.clientX + scrollCtx.scroll, // - rect.left,
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
      x: Math.floor((position.x - LEFT_PADDING) / CELL_W) + 1,
      y: Math.floor(position.y / CELL_H)
    }
  }

  /**
   * Draws the background for the canvas
   */
  const drawBackground = () => {
    if (ctx) {
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
    }
  }

  /**
   * Draw horizontal lines on the canvas
   * @param n Number of lines to draw
   */
  const drawRows = (n: number) => {
    if (ctx) {
      for (let i = 0; i <= n; i++) {
        // Get height of a row
        let marginTop = CELL_H * i

        ctx.strokeStyle = ACCENT_COLOR
        ctx.lineWidth = 0.3
        ctx.beginPath()
        ctx.moveTo(0, marginTop)
        ctx.lineTo(CANVAS_W, marginTop)
        ctx.closePath()
        ctx.stroke()
      }

      ctx.strokeStyle = ACCENT_COLOR_ALT
      ctx.beginPath()
      ctx.moveTo(LEFT_PADDING, 0)
      ctx.lineTo(LEFT_PADDING, CANVAS_H)
      ctx.closePath()
      ctx.stroke()
    }
  }

  /**
   * Draws note name labels (A, A#, ...)
   * @param _notes Pass the array of notes
   */
  const drawLabels = (_notes: Note[]) => {
    if (ctx) {
      let marginTop = CELL_H
      ctx.font = `${CELL_H - 3}px sans-serif`
      ctx.fillStyle = ACCENT_COLOR
      for (const note of _notes) {
        ctx.fillText(note.name, 5, marginTop - 2)
        marginTop += CELL_H
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
      ctx.fillRect(LEFT_PADDING + x * CELL_W, y * CELL_H, CELL_W, CELL_H)
    }
  }

  /**
   * Draws notes by color and position using their
   * pitch(y axis), time(x axis) and waveform(color)
   * @param melody Array of frames to render
   */
  const drawNotes = (melody: Array<SoundFrame|null>) => {
    for (let index = 0; index < melody.length; index++) {
      const frame = melody[index]

      if (frame !== null)
        drawRectangle(index, frame.pitch, getColorFromInstrument(frame.type))
    }
  }

  const drawColumns = () => {
    let columns = CANVAS_W / (CELL_W * 4);
    for (let index = 0; index < columns; index++) {
      if (ctx) {
        ctx.strokeStyle = ACCENT_COLOR
        ctx.lineWidth = 0.3
        ctx.beginPath()
        ctx.moveTo(LEFT_PADDING + CELL_W * 4 * index, 0)
        ctx.lineTo(LEFT_PADDING + CELL_W * 4 * index, CANVAS_H)
        ctx.closePath()
        ctx.stroke()
      }
    }
  }

  return (
    <div className="SoundTimeline">
      <canvas
        className="soundCanvas"
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        onMouseMove={(e) => onInputMove(e)}
        onMouseDown={(e) => onInputStart(e)}
        onMouseUp={onInputStop}
        onMouseLeave={onInputStop}
      ></canvas>
    </div>
  )
}

export default SoundTimeline

const getColorFromInstrument = (instrument: string) => {
  switch (instrument) {
    case "sine":
      return "red"
    case "triangle":
      return "blue"
    case "square":
      return "green"
    case "sawtooth":
      return "orange"  
    default:
      return "purple";
  }
}