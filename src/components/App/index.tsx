import ActuatorList from 'components/actuators/ActuatorList'
import EditPanel from 'components/actuators/EditPanel'
import React from 'react'
import './style.css'
import SoundEditor from 'components/sound/SoundEditor'
import { ScrollableContainer } from 'components/utilities/ScrollableDiv'

function App() {

  return (
    <div className="App">
      <div>
        <ScrollableContainer>
          <SoundEditor />
          <ActuatorList />
        </ScrollableContainer>
      </div>
      <EditPanel />
    </div>
  )
}

export default App
