import ActuatorList from 'components/actuators/ActuatorList'
import EditPanel from 'components/utilities/EditPanel'
import SoundEditor from 'components/sound/SoundEditor'
import { ScrollableContainer } from 'components/utilities/ScrollableDiv'
import React from 'react'
import './style.css'
import { FilePicker } from 'components/utilities/FilePicker'

function App() {

  return (
    <div className="App">
      <ScrollableContainer>
        <SoundEditor />
        <ActuatorList />
      </ScrollableContainer>
      <EditPanel />
      <FilePicker />
    </div>
  )
}

export default App
