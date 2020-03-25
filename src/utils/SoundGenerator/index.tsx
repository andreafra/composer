import { setInterval } from 'timers'

interface Dictionary<T> {
  [key: string]: T
}

interface Note {
  name: string
  freq: number
  octave: number
}

/**
 * Plays a sound with the matching parameters
 * @param freq Frequency (Pitch) of the note
 * @param type The shape of the waveform. Use "custom" to use the 
 * @param volume 
 * @param duration Duration in milliseconds.
 * @param customWaveform Optional, pass to generate a sound from
 * a custom waveform
 */
function playTone(
  freq: number,
  volume: number, 
  type: OscillatorType,
  duration: number = 1,
  customWaveform?: PeriodicWave
) {
  let osc = getSoundGenerator(freq, volume, type, customWaveform)
  osc.start()

  setInterval(() => {
    osc.stop()
  }, duration)
}

/**
 * Returns a generator of sounds (oscillator) that you can start
 * with `.start()` and stop with `.stop()`
 * @param freq Frequency (Pitch) of the note
 * @param type The shape of the waveform. Use "custom" to use the
 * @param volume Gain level
 * @param customWaveform Optional, pass to generate a sound from
 * a custom waveform
 */
function getSoundGenerator(freq: number,
  volume: number,
  type: OscillatorType,
  customWaveform?: PeriodicWave
) {
  let audioContext: AudioContext = new window.AudioContext()
  let oscList: OscillatorNode[] = []
  let masterGainNode: GainNode = audioContext.createGain()
  let noteFreq: Array<Dictionary<number>>
  let sineTerms: Float32Array = new Float32Array([0, 0, 1, 0, 1])
  let cosineTerms: Float32Array = new Float32Array(sineTerms.length)

  customWaveform = audioContext.createPeriodicWave(cosineTerms, sineTerms)

  masterGainNode.connect(audioContext.destination)
  masterGainNode.gain.value = 1

  let osc = audioContext.createOscillator()
  osc.connect(masterGainNode)
  if (type === "custom" && customWaveform !== undefined) {
    osc.setPeriodicWave(customWaveform)
  } else {
    osc.type = type
  }

  osc.frequency.value = freq

  return osc
}

/**
   * Returns the frequencies of the specified octaves
   * The same note (e.g.: C) has double the frequency of itself in the
   * previous octave.
   * @param notes The Array of notes you want to fill
   * @param startOctave number of first octave (0 is like really low, 3 recommended)
   * @param endOctave number of last octave (7 is really high)
   */
function createNoteTable(
  startOctave: number,
  endOctave: number
): Note[] {
  let baseOctave: Dictionary<number> = {}
  baseOctave["C"] = 32.703195662574829
  baseOctave["C#"] = 34.647828872109012
  baseOctave["D"] = 36.708095989675945
  baseOctave["D#"] = 38.890872965260113
  baseOctave["E"] = 41.203444614108741
  baseOctave["F"] = 43.653528929125485
  baseOctave["F#"] = 46.249302838954299
  baseOctave["G"] = 48.999429497718661
  baseOctave["G#"] = 51.913087197493142
  baseOctave["A"] = 55.000000000000000
  baseOctave["A#"] = 58.270470189761239
  baseOctave["B"] = 61.735412657015513

  let newNotes: Note[] = []

  for (let i = 0; i <= endOctave - startOctave; i++) {
    for (let key in baseOctave) {
      newNotes.push({
        name: key,
        freq: baseOctave[key] * Math.pow(2, startOctave + i),
        octave: startOctave + i
      })
    }
  }

  return newNotes
}

export { 
  createNoteTable,
  getSoundGenerator,
  playTone
}