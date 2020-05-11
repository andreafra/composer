interface Dictionary<T> {
  [key: string]: T
}

interface Note {
  name: string
  freq: number
  octave: number
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
  createNoteTable
}
