import SoundTimeline from 'components/sound/SoundTimeline'
import VolumeTimeline from 'components/sound/VolumeTimeline'
import React, { useState } from 'react'
import './style.css'
import { CommandBar, ICommandBarItemProps } from '@fluentui/react'
import { useSelector } from 'react-redux'
import { ComposerState, SoundFrame } from 'types'
import DownloadJS from 'downloadjs'
import FoldableDiv from 'components/utilities/FoldableDiv'

function SoundEditor() {


  const [play, setPlay] = useState(false);
  const state = useSelector((state: ComposerState) => state)
  const melody = useSelector((state: ComposerState) => state.sound)
  const tempo = useSelector((state: ComposerState) => state.system.editorOptions.resolution)

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
    console.log(DownloadJS)
    DownloadJS(JSON.stringify(state), state.system.filename + ".json", "application/json")
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
  ];

  return (
    <div className="SoundEditor">
      <FoldableDiv title="Sound">
        <>
          <CommandBar
            items={_items}
            ariaLabel="Use left and right arrow keys to navigate between commands"
          />
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

/**
 * Singleton for player
 */
class Player {
  static _instance : Player | null = null;

  _melody: Array<SoundFrame | null>
  _oscillator: OscillatorNode
  _gainNode: GainNode
  _tempo: number
  _loop: any
  _position: number
  _isPlaying: boolean

  constructor() {
    if(Player._instance) {
        throw new Error("Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.");
    } else {
      let AudioContext = window.AudioContext
      let audioCtx = new AudioContext();
    
      // create Oscillator and gain node
      let oscillator = audioCtx.createOscillator()
      let gainNode = audioCtx.createGain()
    
      // connect oscillator to gain node to speakers
      oscillator.connect(gainNode)
      gainNode.connect(audioCtx.destination)
    
      // set default options
      oscillator.detune.value = 100 // value in cents, IDK what this does :)
      oscillator.frequency.value = 0 // pitch
      oscillator.type = "sine" // instrument
      gainNode.gain.value = 0 // volume

      oscillator.start()

      // Initialize content
      this._oscillator = oscillator
      this._gainNode = gainNode
      this._melody = []
      this._tempo = 500 //ms
      this._position = 0
      this._isPlaying = false
    }
  }

  static get instance() : Player {
    if (Player._instance === null) {
      Player._instance = new Player()
    }
    return this._instance!
  }

  static set melody(m: SoundFrame[]) {
    Player._instance!._melody = m
  }

  static play(callback: () => void) {
    if (!Player.instance._isPlaying) {
      Player.instance._isPlaying = true

      Player.instance!._loop = setInterval(() => {
        // Stop if we're at the end
        if (Player.instance._position >= Player.instance._melody.length) {
          this.stop()
          callback()
          console.log(Player.instance._oscillator)
          return
        }
        // current soundFrame
        const sf = Player.instance!._melody[Player.instance._position]
        // Play only if there's a note
        if (sf) {
          Player.instance!._oscillator.frequency.value = sf.note.freq
          Player.instance!._oscillator.type = sf.type
          Player.instance!._gainNode.gain.value = sf.volume
        } else {
          this.reset()
        }
        // Go to next frame
        Player.instance._position += 1
      }, Player.instance!._tempo)
    }
  }

  static stop() {
      clearInterval(Player.instance!._loop)
      Player.instance._isPlaying = false
      Player.instance._position = 0
      this.reset()
      // Stopping destroys the Oscillator and you can't restart it again.
      // Player.instance!._oscillator.stop()
  }

  static set tempo(period: number) {
    Player.instance!._tempo = period
  }

  static reset() {
    Player.instance!._oscillator.frequency.value = 0
    Player.instance!._gainNode.gain.value = 0
  }
}
