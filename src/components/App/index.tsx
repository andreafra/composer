import React from 'react'
import './style.css'

import { EditorOptions } from 'types'
import ActuatorList from 'components/actuators/ActuatorList'
import EditPanel from 'components/actuators/EditPanel'

function App() {

  return (
    <div className="App">
      <ActuatorList />
      <EditPanel />
    </div>
  )
}

export default App
