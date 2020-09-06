import { SoundFrame } from "types";

/**
 * Singleton for player
 * <br/>
 * It still has some issues with popping:
 * a possible solution could be generating an oscillator for each note,
 * and switching between them, instead of updating the same oscillator.
 * 
 * It might be migrated to 
 * https://tonejs.github.io/docs/ for better
 * usability.
 */
export default class Player {
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

      // It should lower the highest notes
      let compressor = audioCtx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-30, audioCtx.currentTime);
      compressor.knee.setValueAtTime(40, audioCtx.currentTime);
      compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
      compressor.attack.setValueAtTime(0, audioCtx.currentTime);
      compressor.release.setValueAtTime(0.25, audioCtx.currentTime);

      // connect oscillator to gain node to speakers
      oscillator.connect(gainNode)
      oscillator.connect(compressor)
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

  static play(updatePosition: (t: number) => void, callback: () => void) {
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
          Player.instance._oscillator.frequency.value = sf.note.freq
          Player.instance._oscillator.type = sf.type
          // Player.instance._gainNode.gain.value = sf.volume
          Player.instance._gainNode.gain.value = sf.volume
        } else {
          this.reset()
        }
        // Go to next frame
        Player.instance._position += 1
        updatePosition(Player.instance._position)
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
