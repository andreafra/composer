import React, { useState } from 'react'
import './style.css'

import SoundEditor from 'components/SoundEditor'
import LightEditor from 'components/LightEditor'

function App() {

  // The total length of the track/song/whatever
  const [editorLength, setEditorLength] = useState(5) // in seconds

  // A single "frame", meaning a block on the timeline
  const [editorResolution, setEditorResolution] = useState(100) // in ms
  const [editorFrameSize, setEditorFrameSize] = useState(30) // in px

  /**
   * Length in pixels of a generic editor.
   * (CHECK: Might not update correctly?)
   */
  const editorWidth = editorLength * 1000 / editorResolution * editorFrameSize

  const editorLeftPadding = 30

  return (
    <div className="App">
      <SoundEditor />
      <LightEditor
        editorLeftPadding={editorLeftPadding}
        editorResolution={editorResolution}
        editorWidth={editorWidth}
        editorFrameSize={editorFrameSize}
      />
    </div>
  )
}

export default App
