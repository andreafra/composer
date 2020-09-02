import { CurrentInstantMarkerCtx } from "components/App"
import { useContext, useEffect, useState } from "react"
import { Oscillator, Sequence, Transport, Synth, Volume } from "tone"
import { SoundFrame } from "types"

const volume = new Volume(-12).toDestination()
const synth = new Synth().connect(volume).toDestination();

export default function usePlayer() {

  const [isPlaying, setIsPlaying] = useState(false)

  // let currentFrameCtx = useContext(CurrentInstantMarkerCtx)

  // // Every time the melody changes
  // useEffect(() => {

  // }, [melody])

  // const generateNotesArray = () : number[] => {
  //   return melody.map((frame) => frame ? frame.note.freq : 0)
  // }

  return {
    isPlaying: isPlaying,
    play: () => {
    
    },
    pause: () => {

    },
    stop: () => {
      
    }
  }
}