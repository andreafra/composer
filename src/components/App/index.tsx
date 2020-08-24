import ActuatorList from 'components/actuators/ActuatorList'
import FileDetails from 'components/modals/FileDetails'
import FilePicker from 'components/modals/FilePicker'
import SoundEditor from 'components/sound/SoundEditor'
import { ScrollableContainer } from 'components/utilities/ScrollableDiv'
import React, { createContext, useContext, useState } from 'react'
import { DetailPanel } from 'types'
import Menu from './menu'
import './style.css'

export const DetailPanelCtx = createContext<{value: DetailPanel, changeValue: Function}>({
  value: "NONE",
  changeValue: (value: DetailPanel) => {}
})

function App() {

  const [activePanel, setActivePanel]: [DetailPanel, any] = useState("NONE")
  const detailPanel = useContext(DetailPanelCtx)
  
  detailPanel.value = activePanel
  detailPanel.changeValue = (value: DetailPanel) => setActivePanel(value)

  return (
    <div className="App">
      <Menu />
      <ScrollableContainer>
        <SoundEditor />
        <ActuatorList />
      </ScrollableContainer>
    <FilePicker />
    <FileDetails />
    </div>
  )
}

export default App
