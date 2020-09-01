import SoundTimeline from 'components/sound/SoundTimeline'
import VolumeTimeline from 'components/sound/VolumeTimeline'
import FoldableDiv from 'components/utilities/FoldableDiv'
import { ScrollableDiv } from 'components/utilities/ScrollableDiv'
import Timeline from 'components/utilities/Timeline'
import React, { useState } from 'react'
import InstrumentPicker from '../InstrumentPicker'
import './style.css'

function SoundEditor() {

  const [play, setPlay] = useState(false);

  const handlePlay = () => {
   
  }

  const handleStop = () => {
  
  }

  return (
    <div className="SoundEditor">
      <FoldableDiv title="Sound">
        <InstrumentPicker
          currentType={"square"}
          update={(t: OscillatorType) => {}}
        />
        <ScrollableDiv>
          <Timeline />
          <SoundTimeline />
          <VolumeTimeline />
        </ScrollableDiv>
      </FoldableDiv>
    </div>
  )
}

export default SoundEditor
