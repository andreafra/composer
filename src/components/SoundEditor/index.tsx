import React, { useState, Dispatch } from 'react'
import './style.css'

import { createNoteTable } from '../SoundGenerator'

interface Note {
  freq: number,
  volume: number,
  duration: number,
  type: OscillatorType,
}

function SoundEditor() {

  const [resolution, setResolution]: [number, any] = useState(100) // in milliseconds
  const [melody, setMelody]: [Note[], any] = useState([])

  const notes = createNoteTable(3, 5)

  return (
    <div className="soundEditor">
      <h2>Sounds</h2>
    </div>
  )
}

export default SoundEditor