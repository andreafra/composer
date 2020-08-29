import { ComposerState, EditorOptions, SoundFrame, Channel } from "types";

export default class Compiler {
  options: EditorOptions;
  sound: (SoundFrame | null)[];
  actuators: Channel[];
  constructor(state: ComposerState) {
    this.options = state.system.editorOptions;
    this.sound = state.sound;
    this.actuators = state.actuators;
  }

  build = () => {
    return this.header()
    + this.speaker()
    + this.getActuatorsDefs()
    + this.setup()
    + this.loop()
  }
  
  header = () => {
    return `// FRAME SIZE AND TOTAL LENGTH
#define FRAME_LENGTH_MS ${this.options.resolution}
#define FILE_LENGTH ${this.options.width / this.options.frameSize}
`
  }

  setup = () => {
    return `void setup() {
  // SOUND BUZZER
  pinMode(SOUND_PIN, OUTPUT);
  // SETUP LED, MOTORS
  ${this.getActuatorsSetup()}
}
`
  }

  loop = () => {
    return `// HANDLE UPDATE RATE
long lastUpdate = 0;
int updates = 0;

int soundCounter = 0;
int soundTicksRemaining = 0;

void loop() {
  unsigned long currentUpdateMillis = millis();
  
  if (currentUpdateMillis - lastUpdate > FRAME_LENGTH_MS && updates < FILE_LENGTH) {
    lastUpdate = currentUpdateMillis;
    // Every frame, execute this block of code
    
    ${this.getSoundLoop()}
    // SETUP LED, MOTORS
    ${this.getActuatorsLoop()}
    updates++;
  }
}
`
  }

  // TODO: Fix PIN 9
  speaker = () => {
    return `// INITIALIZE SOUND DEVICE
#define SOUND_PIN 9
${this.generateNotes()}
`
  }

  generateNotes = () => {
    let notes_freq = "const int SOUND_FREQ[] = {" // the frequencies to play
    let notes_length = "const byte SOUND_DURATION[] = {" // how long each frequency lasts
    let lastFreq = undefined // the last frequency added
    let lastFreqQty = 0 // how many identical freqs have been parsed consecutively
    let intervals = 0 // how many different sequences of freqs are in the array
    let i = 0
    while(i <= this.sound.length) {
      let freq = Math.round(this.sound[i]?.note.freq || 0)
      if (freq === lastFreq) {
        lastFreqQty++
      } else {
        if (lastFreq !== undefined) {
          notes_freq += lastFreq.toString() + ","
          notes_length += lastFreqQty.toString() + ","
        }
        lastFreq = freq
        lastFreqQty = 1
        intervals++
      }
      i++
    }
    notes_freq += "};"
    notes_length += "};"
    return notes_freq + "\n" + notes_length + `\n#define SOUND_SIZE ${intervals - 1}`
  }

  getSoundLoop = () => {
    return `// SOUND: Tone - Square Wave
    if (soundCounter < SOUND_SIZE) {
      if (soundTicksRemaining == 0) {
        tone(SOUND_PIN, SOUND_FREQ[soundCounter], SOUND_DURATION[soundCounter] * FRAME_LENGTH_MS);
        soundTicksRemaining = SOUND_DURATION[soundCounter] - 1;
        soundCounter++;
      } else {
        soundTicksRemaining--;
      }
    } else noTone(SOUND_PIN);
    `
  }
  
  getActuatorsDefs = () => {
    return ""
  }

  getActuatorsSetup = () => {
    return ""
  }

  getActuatorsLoop = () => {
    return ""
  }

}