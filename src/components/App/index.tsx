import ActuatorList from 'components/actuators/ActuatorList'
import EditPanel from 'components/actuators/EditPanel'
import React from 'react'
import './style.css'

function App() {

  return (
    <div className="App">
      <ActuatorList />
      <EditPanel />
    </div>
  )
}

export default App
