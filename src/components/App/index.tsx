import ActuatorList from 'components/actuators/ActuatorList'
import EditPanel from 'components/utilities/EditPanel'
import SoundEditor from 'components/sound/SoundEditor'
import { ScrollableContainer } from 'components/utilities/ScrollableDiv'
import React from 'react'
import './style.css'

function App() {

  return (
    <div className="App">
      <ScrollableContainer>
        <SoundEditor />
        <ActuatorList />
      </ScrollableContainer>
      <EditPanel />
    </div>
  )
}

export default App
