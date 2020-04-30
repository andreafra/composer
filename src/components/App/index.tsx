import React, { useState } from 'react'
import './style.css'

import LightEditor from 'components/actuators/Editor/LightEditor'
import SoundEditor from 'components/sound/SoundEditor'
import { EditorOptions } from 'types'

function App() {

  // The total length of the track/song/whatever
  const [editorLength, setEditorLength] = useState(5) // in seconds

  // A single "frame", meaning a block on the timeline
  const [editorResolution, setEditorResolution] = useState(100) // in ms
  const [editorFrameSize, setEditorFrameSize] = useState(30) // in px

  /**
   * Length in pixels of a generic editor.
   */
  const editorWidth = editorLength * 1000 / editorResolution * editorFrameSize

  const EDITOR_LEFT_PADDING = 30 // in px

  // const myTheme = createTheme({
  //   palette: {
  //     themePrimary: '#d6226d',
  //     themeLighterAlt: '#fdf5f8',
  //     themeLighter: '#f8d7e5',
  //     themeLight: '#f3b6cf',
  //     themeTertiary: '#e772a3',
  //     themeSecondary: '#db397d',
  //     themeDarkAlt: '#c11f62',
  //     themeDark: '#a31a53',
  //     themeDarker: '#78133d',
  //     neutralLighterAlt: '#f8f8f8',
  //     neutralLighter: '#f4f4f4',
  //     neutralLight: '#eaeaea',
  //     neutralQuaternaryAlt: '#dadada',
  //     neutralQuaternary: '#d0d0d0',
  //     neutralTertiaryAlt: '#c8c8c8',
  //     neutralTertiary: '#595959',
  //     neutralSecondary: '#373737',
  //     neutralPrimaryAlt: '#2f2f2f',
  //     neutralPrimary: '#000000',
  //     neutralDark: '#151515',
  //     black: '#0b0b0b',
  //     white: '#ffffff',
  //   }});

  const editorOptions: EditorOptions = {
    leftPadding: EDITOR_LEFT_PADDING,
    resolution: editorResolution,
    width: editorWidth,
    frameSize: editorFrameSize
  }

  return (
    <div className="App">
      <SoundEditor
        options={editorOptions}
      />
      <LightEditor
        options={editorOptions}
      />
    </div>
  )
}

export default App
