import SoundTimeline from 'components/sound/SoundTimeline'
import VolumeTimeline from 'components/sound/VolumeTimeline'
import React, { useState } from 'react'
import './style.css'
import { CommandBar, ICommandBarItemProps } from '@fluentui/react'
import { useSelector } from 'react-redux'
import { ComposerState, SoundFrame } from 'types'


function SoundEditor() {


  const [play, setPlay] = useState(false);

  const _items: ICommandBarItemProps[] = [
    {
      key: 'play',
      text: play ? 'Pause' : 'Play',
      iconProps: { iconName: play ? 'Pause' : 'Play' },
      onClick: () => {
        setPlay(!play)
      }
    },
    {
      key: 'stop',
      text: 'Stop',
      iconProps: { iconName: 'Stop' },
      onClick: () => setPlay(false),
    },
    {
      key: 'download',
      text: 'Download',
      iconProps: { iconName: 'Download' },
      onClick: () => console.log('Download'),
    },
  ];

  return (
    <div className="soundEditor">
      <h2>Sounds</h2>
      <CommandBar
        items={_items}
        ariaLabel="Use left and right arrow keys to navigate between commands"
      />
      <h3>Pitch</h3>
      <SoundTimeline />
      <h3>Volume</h3>
      <p>Hold Shift to lock the volume</p>
      <VolumeTimeline />
    </div>
  )
}

export default SoundEditor


// function Player(props: {
//   play: boolean,
//   updateFrame: (frame: number) => void
// }) {
//   const {oscillator, gainNode} = usePlayer()
//   const options = useSelector((state: ComposerState) => state.system.editorOptions)
//   const melody = useSelector((state: ComposerState) => state.sound)
  

//   let i = 0;

//   let loop = setInterval(() => {
//     // stop if not playing
//     if (props.play === false || i >= melody.length) {
//       clearInterval(loop)
//       props.updateFrame(i)
//       oscillator.stop()
//     }

//     const sf = melody[i]
//     if (sf) {
//       oscillator.frequency.value = sf.note.freq
//       oscillator.type = sf.type
//       gainNode.gain.value = sf.volume
//     } else {
//       oscillator.frequency.value = 0
//       gainNode.gain.value = 0
//     }
//     // Go to next frame
//     i += 1
//   }, options.resolution)

//   return null
// }

// TODO: MAKE PLAYER A SINGLETON (FUCK IT)
// function usePlayer() {
//   let AudioContext = window.AudioContext
//   let audioCtx = new AudioContext();

//   // create Oscillator and gain node
//   let oscillator = audioCtx.createOscillator()
//   let gainNode = audioCtx.createGain()

//   // connect oscillator to gain node to speakers
//   oscillator.connect(gainNode)
//   gainNode.connect(audioCtx.destination)

//   // set default options
//   oscillator.detune.value = 100 // value in cents, IDK what this does :)
//   oscillator.frequency.value = 0 // pitch
//   oscillator.type = "sine" // instrument
//   gainNode.gain.value = 0 // volume

//   oscillator.start(0) // start now

//   return {oscillator, gainNode}
// }