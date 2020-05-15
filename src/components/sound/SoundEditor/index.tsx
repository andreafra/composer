import SoundTimeline from 'components/sound/SoundTimeline'
import VolumeTimeline from 'components/sound/VolumeTimeline'
import React, { useState } from 'react'
import './style.css'
import { CommandBar, ICommandBarItemProps, Layer } from '@fluentui/react'
import { useSelector, useDispatch } from 'react-redux'
import { ComposerState, SoundFrame } from 'types'
import DownloadJS from 'downloadjs'
import FoldableDiv from 'components/utilities/FoldableDiv'
import { useJSONFilteredOutput } from 'utils/JSONFilteredOutput'
import Player from 'utils/Player'
import { setEditPanelScope, setEditPanelVisibility } from 'store/actions'

function SoundEditor() {

  const [pinToolbar, setPinToolbar] = useState(false)
  const [play, setPlay] = useState(false);

  const dispatch = useDispatch()
  const state = useSelector((state: ComposerState) => state)
  const melody = useSelector((state: ComposerState) => state.sound)
  const tempo = useSelector((state: ComposerState) => state.system.editorOptions.resolution)

  const parsedOutput = useJSONFilteredOutput()

  const player = Player.instance

  // Set speed
  player._tempo = tempo

  const handlePlay = () => {
    if (play === false) {
      setPlay(true)
      player._melody = melody
      Player.play(() => setPlay(false))
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
          <SoundTimeline />
          <h3 className="App-title SoundEditor-title">Volume</h3>
          <VolumeTimeline />
        </>
      </FoldableDiv>
    </div>
  )
}

export default SoundEditor
