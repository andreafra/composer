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

export const CurrentInstantMarkerCtx = createContext<{value: number, changeValue: Function}>({
  value: 0,
  changeValue: (value: number) => {}
})

function App() {

  const [activePanel, setActivePanel]: [DetailPanel, any] = useState("NONE")
  const [currentInstant, setCurrentInstant]: [number, any] = useState(0)

  const detailPanel = useContext(DetailPanelCtx)
  const currentInstantCtx = useContext(CurrentInstantMarkerCtx)

  detailPanel.value = activePanel
  detailPanel.changeValue = (value: DetailPanel) => setActivePanel(value)

  currentInstantCtx.value = currentInstant
  currentInstantCtx.changeValue = (value: number) => setCurrentInstant(value)

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
