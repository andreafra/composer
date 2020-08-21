import { CommandBar, ICommandBarItemProps, Layer } from '@fluentui/react'
import SoundTimeline from 'components/sound/SoundTimeline'
import VolumeTimeline from 'components/sound/VolumeTimeline'
import FoldableDiv from 'components/utilities/FoldableDiv'
import DownloadJS from 'downloadjs'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setEditPanelScope, setEditPanelVisibility, setFilePickerVisibility } from 'store/actions'
import { ComposerState } from 'types'
import { useJSONFilteredOutput } from 'utils/JSONFilteredOutput'
import Player from 'utils/Player'
import './style.css'
import FileManager from 'utils/FileManager'

function SoundEditor() {

  const [pinToolbar, setPinToolbar] = useState(false)
  const [play, setPlay] = useState(false);

  const fileManager = new FileManager()

  const dispatch = useDispatch()
  const state = useSelector((state: ComposerState) => state)
  const melody = useSelector((state: ComposerState) => state.sound)
  const tempo = useSelector((state: ComposerState) => state.system.editorOptions.resolution)

  const parsedOutput = useJSONFilteredOutput()

  const player = Player.instance

  // Set speed
  player._tempo = tempo

  const [position, setPosition] = useState(0);

  const handlePlay = () => {
    if (play === false) {
      setPlay(true)
      player._melody = melody
      Player.play((t) => setPosition(t), () => setPlay(false))
    } else {
      handleStop()
    }
  }

  const handleStop = () => {
    setPlay(false)
    Player.stop()
  }

  const handleDownload = () => {
    DownloadJS(parsedOutput(), state.system.filename + ".json", "application/json")
  }

  const handleSaveWithDownload = () => {
    DownloadJS(JSON.stringify(state), state.system.filename + ".json", "application/json")
  }

  const handleSave = () => {
    console.log("Saving file...")
    fileManager.setFile(state)
  }

  const handleOpen = () => {
    dispatch(setFilePickerVisibility(true))    
  }

  const handleOptions = () => {
    dispatch(setEditPanelVisibility(true))
    dispatch(setEditPanelScope("SYSTEM"))
  }


  const _items: ICommandBarItemProps[] = [
    {
      key: 'play',
      text: play ? 'Pause' : 'Play',
      iconProps: { iconName: play ? 'Pause' : 'Play' },
      onClick: handlePlay
    },
    {
      key: 'stop',
      text: 'Stop',
      iconProps: { iconName: 'Stop' },
      onClick: handleStop,
    },
    {
      key: 'download',
      text: 'Download',
      iconProps: { iconName: 'Download' },
      onClick: handleDownload
    },
    {
      key: 'save',
      text: 'Save',
      iconProps: { iconName: 'Save' },
      subMenuProps: {
        items: [
          {
            key: 'save',
            text: 'Save',
            iconProps: { iconName: 'Save' },
            onClick: handleSave
          },
          {
            key: 'saveToPC',
            text: 'Save to Computer',
            iconProps: { iconName: 'Download' },
            onClick: handleSaveWithDownload
          }
        ]
      }
    },
    {
      key: 'open',
      text: 'Load',
      iconProps: { iconName: 'OpenFolderHorizontal' },
      onClick: handleOpen
    },
    {
      key: 'options',
      text: 'Options',
      iconProps: { iconName: 'Settings' },
      onClick: handleOptions
    },
  ];

  const _farItems: ICommandBarItemProps[] = [
    {
      key: 'pin',
      text: pinToolbar ? 'Unpin' : 'Pin',
      iconProps: { iconName: pinToolbar ? 'Unpin' : 'Pin' },
      onClick: () => setPinToolbar(!pinToolbar)
    }
  ]

  const toolbar = <CommandBar
    items={_items}
    farItems={_farItems}
    ariaLabel="Use left and right arrow keys to navigate between commands"
  />

  return (
    <div className="SoundEditor">
      <FoldableDiv title="Sound">
        <>
          {pinToolbar ? <Layer>{toolbar}</Layer> : toolbar}
          <h3 className="App-title SoundEditor-title">Pitch</h3>
          <SoundTimeline position={position} />
          <h3 className="App-title SoundEditor-title">Volume</h3>
          <VolumeTimeline />
        </>
      </FoldableDiv>
    </div>
  )
}

export default SoundEditor
