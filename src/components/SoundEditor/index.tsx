import React, { useState, useMemo } from 'react'
import './style.css'

import { createNoteTable } from 'utils/SoundGenerator'
import SoundCanvas from 'components/SoundCanvas'

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

interface NoteUpdateCallbackData {
  note: Note,
  time: number,
  type: OscillatorType,
  pitch: number
}

function SoundEditor() {

  const [resolution, setResolution]: [number, any] = useState(100) // in ms
  const [melody, setMelody]: [Frame[], any] = useState([])

  // Init notes frequencies
  // TODO: replace 3, 5 with actual parameters
  const notes = useMemo(() => createNoteTable(3, 5), [3, 5])

  /**
   * Call this method when you want to update the 
   * @param note The new note you want to write in the x,y position of the melody
   */
  const updateNote = (data: NoteUpdateCallbackData) => {
    console.log(data)
    let newMelody = melody.slice(0)

    // create/update a Frame
    newMelody[data.time] = {
      ...newMelody[data.time],
      note: data.note,
      type: data.type,
      pitch: data.pitch
    }
    setMelody(newMelody)
  }

  return (
    <div className="soundEditor">
      <h2>Sounds</h2>
      <SoundCanvas
        notes={notes}
        melody={melody}
        update={(note: NoteUpdateCallbackData) => updateNote(note)}
      />
    </div>
  )
}

export default SoundEditor