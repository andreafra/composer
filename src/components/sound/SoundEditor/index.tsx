import SoundTimeline from 'components/sound/SoundTimeline'
import VolumeTimeline from 'components/sound/VolumeTimeline'
import FoldableDiv from 'components/utilities/FoldableDiv'
import React, { createContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ComposerState } from 'types'
import Player from 'utils/Player'
import './style.css'

export const CurrentInstantMarkerCtx = createContext<number>(0)

function SoundEditor() {

  const [play, setPlay] = useState(false);

  const dispatch = useDispatch()
  const state = useSelector((state: ComposerState) => state)
  const melody = useSelector((state: ComposerState) => state.sound)
  const tempo = useSelector((state: ComposerState) => state.system.editorOptions.resolution)

  const player = Player.instance

  // Set speed
  player._tempo = tempo

  const handlePlay = () => {
    // if (play === false) {
    //   setPlay(true)
    //   player._melody = melody
    //   Player.play((t) => setPosition(t), () => setPlay(false))
    // } else {
    //   handleStop()
    // }
  }

  const handleStop = () => {
    // setPlay(false)
    // Player.stop()
  }

  return (
    <div className="SoundEditor">
      <FoldableDiv title="Sound">
        <>
          <SoundTimeline />
          <VolumeTimeline />
        </>
      </FoldableDiv>
    </div>
  )
}

export default SoundEditor
