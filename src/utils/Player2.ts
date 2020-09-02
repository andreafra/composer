import { CurrentInstantMarkerCtx } from "components/App"
import { useContext, useEffect, useState, useMemo, useCallback } from "react"
import { useSelector } from "react-redux"
import { Offline, Oscillator, Synth, Volume, Player, PolySynth, ToneEvent, Sequence, Transport } from "tone"
import { ComposerState, SoundFrame } from "types"
import { generate } from "shortid"

const volume = new Volume(-12).toDestination()
const synth = new Synth().connect(volume).toDestination();

export default function usePlayer() {

  const currentFrameCtx = useContext(CurrentInstantMarkerCtx)
  const melody = useSelector((state: ComposerState) => state.sound)
  const options = useSelector((state: ComposerState) => state.system.editorOptions)

  const [isPlaying, setIsPlaying] = useState(false)
  const [player, setPlayer] = useState(new Player())
  const durationInSeconds = options.resolution / 1000


  /**
   * Return a new updated instance of a player created with ToneJS.
   * It pre-records the notes into a buffer
   */
  const generatePlayer = (_melody: (SoundFrame|null)[]) => {
    if (_melody.length === 0) return null
    let newMelody = simplifyMelody(_melody)

    return Offline(({ transport }) => {
      const synth = new Synth().toDestination();
      newMelody.forEach((note) =>
        synth.triggerAttackRelease(note.freq, note.duration, note.start)
      )
      // make sure to start the transport
      transport.start(0);
    }, melody.length * durationInSeconds).then((buffer) => {
      // do something with the output buffer
      const newPlayer = new Player(buffer).toDestination()
      setPlayer(newPlayer)
      return newPlayer
    })
  }

  /**
   * Returns the melody, simplified by collapsing identical notes.
   */
  const simplifyMelody = (_melody: (SoundFrame|null)[]) => {

    let simplifiedMelody = new Array<SimplifiedFrame>()

    // init defaults
    let lastFrame: SoundFrame | null = null
    let currFrame: SimplifiedFrame = {
      freq: 0,
      type: "square",
      volume: 0,
      duration: 0,
      start: 0
    }
    // loop through melody collapsing identical frames into one accounting for duration.
    _melody.forEach((frame, index) => {
      if (frame === lastFrame && frame === null) { // both null
        currFrame = {
          ...currFrame,
          duration: currFrame.duration + 1
        }
      } else if (frame && lastFrame
        && frame.note.freq === lastFrame.note.freq
        && frame.type === frame.type
        && frame.volume === lastFrame.volume) { // both not-null, same frame
        currFrame = {
          ...currFrame,
          duration: currFrame.duration + 1
        }
      } else {
        if (currFrame !== undefined)
          if (currFrame.duration !== 0)
            simplifiedMelody.push(currFrame)
        if (frame === null) {
          currFrame = {
            freq: 0,
            type: "square",
            volume: 0,
            duration: 1,
            start: index * durationInSeconds
          }
        } else {
          currFrame = {
            freq: frame.note.freq,
            type: frame.type,
            volume: frame.volume,
            duration: 1,
            start: index * durationInSeconds
          }
        }
      }
      // set last frame
      lastFrame = frame
    })
    // Add the last element, if there's something to add
    if (melody.length !== 0)
      simplifiedMelody.push(currFrame)

    return simplifiedMelody
  }

  // the setInterval referenced
  let update: any
  let timeAtStart: number

  return {
    isPlaying: isPlaying,
    play: () => {
      let _tmp_player = generatePlayer(melody)
      if (!isPlaying && _tmp_player) {
        setIsPlaying(true)
        _tmp_player.then(_player => {
          let offset = currentFrameCtx.value * durationInSeconds

          _player.start(0, offset)
          timeAtStart = player.immediate()
          update = setInterval(() => {
            let timeAtStep = (player.immediate() - timeAtStart) * 1000 // in MS

            currentFrameCtx.changeValue((offset*1000 + timeAtStep)/options.resolution)
            console.log("HELLO")
            // Stop when we're done with the melody
            if (timeAtStep >= (melody.length * options.resolution - offset*1000) + options.resolution/2) {
              setIsPlaying(false)
              _player.stop()
              clearInterval(update)
            }
          }, options.resolution)
        })
      }
    },
    stop: () => {
      clearInterval(update)
      setIsPlaying(false)
      // let timeAtPause = (player.immediate() - timeAtStart) * 1000 // in MS
      currentFrameCtx.changeValue(0)
      player.stop()
    },
  }
}

interface SimplifiedFrame {
  freq: number
  type: string
  volume: number
  duration: number
  start: number
}