import ActuatorList from 'components/actuators/ActuatorList'
import EditPanel from 'components/actuators/EditPanel'
import React from 'react'
import './style.css'
import SoundEditor from 'components/sound/SoundEditor'

function App() {

  return (
    <div className="App">
      <div>
        <SoundEditor />
        <ActuatorList />
      </div>
      <EditPanel />
    </div>
  )
}

export default App
