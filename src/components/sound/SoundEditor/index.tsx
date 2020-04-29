import React, { useState, useMemo } from 'react'
import './style.css'

import { createNoteTable } from 'utils/SoundGenerator'
import VolumeTimeline from 'components/sound/VolumeTimeline'
import SoundTimeline from 'components/sound/SoundTimeline'

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

interface VolumeFrameCallbackData {
  volume: number,
  time: number
}

function SoundEditor(props: any) {

  const [melody, setMelody]: [Frame[], any] = useState([])

  // Init notes frequencies
  // TODO: replace 3, 5 with actual parameters
  const notes = useMemo(() => createNoteTable(3, 5).reverse(), [])

  /**
   * Call this method when you want to update the notes (pitch) of the melody
   * @param note The new note you want to write in the x position of the melody
   */
  const updateNote = (data: NoteUpdateCallbackData) => {
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

  /**
   * Call this method when you want to update the volume of melody
   * @param frame The new volume you want to write in the x position of the melody.
   */
  const deleteNote = (data: NoteUpdateCallbackData) => {
    let newMelody = melody.slice(0)

    // create/update a Frame
    delete newMelody[data.time]
    setMelody(newMelody)
  }

  /**
   * Call this method when you want to update the volume of melody
   * @param frame The new volume you want to write in the x position of the melody.
   */
  const updateVolume = (frame: VolumeFrameCallbackData) => {
    let newMelody = melody.slice(0)

    // create/update a Frame
    newMelody[frame.time] = {
      ...newMelody[frame.time],
      volume: frame.volume
    }
    setMelody(newMelody)
  }

  return (
    <div className="soundEditor">
      <h2>Sounds</h2>      
      <h3>Pitch</h3>
      <SoundTimeline
        options={props.options}
        notes={notes}
        melody={melody}
        update={(note: NoteUpdateCallbackData) => updateNote(note)}
        delete={(note: NoteUpdateCallbackData) => deleteNote(note)}
      />
      <h3>Volume</h3>
      <p>Hold Shift to lock the volume</p>
      <VolumeTimeline
        options={props.options}
        melody={melody}
        update={(frame: VolumeFrameCallbackData) => updateVolume(frame)}
      />
    </div>
  )
}

export default SoundEditor