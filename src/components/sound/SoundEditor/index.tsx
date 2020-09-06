import SoundTimeline from 'components/sound/SoundTimeline'
import VolumeTimeline from 'components/sound/VolumeTimeline'
import FoldableDiv from 'components/utilities/FoldableDiv'
import { ScrollableDiv } from 'components/utilities/ScrollableDiv'
import Timeline from 'components/utilities/Timeline'
import React, { createContext, useContext, useState } from 'react'
import { InstrumentType, MouseMode } from 'types'
import SoundEditorMenu from './menu'
import './style.css'

export const SoundEditorOptionsCtx = createContext<{
  instrumentType: InstrumentType,
  mouseMode: MouseMode,
  changeInstrumentType: Function,
  changeMouseMode: Function
}>({
  instrumentType: "square",
  mouseMode: "draw",
  changeInstrumentType: (value: InstrumentType) => {},
  changeMouseMode: (value: MouseMode) => {}
})

function SoundEditor() {

  const soundEditorOptionsCtx = useContext(SoundEditorOptionsCtx)
  
  const [instrumentType, setInstrumentType]: [InstrumentType, any] = useState("square")
  const [mouseMode, setMouseMode]: [MouseMode, any] = useState("draw")

  soundEditorOptionsCtx.instrumentType = instrumentType
  soundEditorOptionsCtx.changeInstrumentType = (value: InstrumentType) => setInstrumentType(value)  
  soundEditorOptionsCtx.mouseMode = mouseMode
  soundEditorOptionsCtx.changeMouseMode = (value: MouseMode) => setMouseMode(value)  

  return (
    <div className="SoundEditor">
      <FoldableDiv title="Sound">
        <SoundEditorMenu />
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
