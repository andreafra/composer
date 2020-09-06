import { Actuator, Channel, ComposerState, EditorOptions, SoundFrame } from "types";
import { useActuatorModels } from "utils/actuatorModels";
import ActuatorBP_1pin_analog from "./blueprints/actuator_1pin_analog";
import ActuatorBP_1pin_digital from "./blueprints/actuator_1pin_digital";
import ActuatorBP_1pin_servo from "./blueprints/actuator_1pin_servo";
import ActuatorBP_2pin_stepper from "./blueprints/actuator_2pin_stepper";
import ActuatorBP_3pin_dc_hbridge from "./blueprints/actuator_3pin_dc_hbridge";
import ActuatorBP_3pin_rgb from "./blueprints/actuator_3pin_rgb";
import ActuatorBP_3pin_rgb_pwm from "./blueprints/actuator_3pin_rgb_pwm";
import ActuatorBP_4pin_stepper from "./blueprints/actuator_4pin_stepper";
import SoundBlueprint from "./blueprints/sound";

/**
 * A compiler is a class handling the creation of source code
 * for a specific platform, providing a function to export it as a string.
 * The download of the file should be handled separately in the
 * src/components/App/menu.tsx.
 * 
 * This file provides an example on how to retrieve data from the store,
 * how to process it, and how to assemble it, in this case to produce
 * an Arduino Scratch file, that can be compiled and uploaded to a board.
 * 
 * Utilizes template code contained in the blueprint/ folder.
 */
export default class Compiler {
  options: EditorOptions
  sound: (SoundFrame | null)[]
  actuators: Channel[]
  actuatorDefs: Actuator[]

  /**
   * Creates a new instance of the compiler by saving locally the various fields to parse.
   * @param state The state of the app that you want to export.
   */
  constructor(state: ComposerState) {
    this.options = state.system.editorOptions;
    this.sound = state.sound;
    this.actuators = state.actuators;
    this.actuatorDefs = useActuatorModels();
    // sort each actuator frames
    this.actuators.forEach(act => {
      act.frames.sort((a, b) => a.start - b.start)
    })
  }

  /**
   * Returns a string containing the compiled file,
   * by assembling the various parts of it.
   */
  build = (): string => {
    return this.header()
    + this.getSoundDefs()
    + this.getActuatorsDefs()
    + this.setup()
    + this.loop()
  }
  
  /**
   * Returns global, general definitions to use in the source file.
   */
  header = () => {
    return `// FRAME SIZE AND TOTAL LENGTH
#define FRAME_LENGTH_MS ${this.options.resolution}
#define FILE_LENGTH ${this.options.width / this.options.frameSize}
`
  }

  /**
   * Returns an assembled arduino setup() function.
   * Code in this function will be executed once.
   */
  setup = () => {
    return `void setup() {
  ${this.getSoundSetup()}
  ${this.getActuatorsSetup()}
}
`
  }

  /**
   * Returns an assembled arduino loop() function.
   * Code in this function will be executed iteratively.
   */
  loop = () => {
    return `\n// Handle update rate
long lastUpdate = 0;
int currentFrame = 0;

void loop() {
  unsigned long currentUpdateMillis = millis();
  
  if (currentUpdateMillis - lastUpdate > FRAME_LENGTH_MS && currentFrame < FILE_LENGTH) {
    lastUpdate = currentUpdateMillis;
    // Every frame, execute this block of code    
    ${this.getSoundLoop()}
    ${this.getActuatorsLoop()}
    currentFrame++;
  }
}
`
  }

  /**
   * Returns an objet containing a string of notes frequencies, comma separated,
   * a string of notes lengths in milliseconds, comma separated, and the number
   * of notes/lengths contained in each string.
   */
  generateNotes = () => {
    let notes_freq = "" // the frequencies to play
    let notes_length = "" // how long each frequency lasts
    let lastFreq = undefined // the last frequency added
    let lastFreqQty = 0 // how many identical freqs have been parsed consecutively
    let intervals = 0 // how many different sequences of freqs are in the array
    let i = 0
    while(i < this.sound.length) {
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
    // Add last note
    if (lastFreq !== undefined) {
      notes_freq += lastFreq.toString() + ","
      notes_length += lastFreqQty.toString() + ","
    }
    return {
      freq: notes_freq,
      duration: notes_length,
      size: intervals.toString()
    }
  }

  /**
   * Return sound related macros and global variables.
   * Replaces variables starting with $.
   */
  getSoundDefs = () => {
    let notes = this.generateNotes()
    let code = SoundBlueprint.definition
    .replace("$pin", this.options.speakerPin.toString())
    .replace("$size", notes.size)
    .replace("$freq_array", notes.freq)
    .replace("$duration_array", notes.duration)
    return code
  }

  /**
   * Return sound related setup fetched from the blueprint.
   */
  getSoundSetup = () => {
    return SoundBlueprint.setup
  }

  /**
   * Return sound related loop fetched from the blueprint.
   */
  getSoundLoop = () => {
    return SoundBlueprint.loop
  }
  
  /**
   * Return a matching blueprint for the actuator of the type
   * passed as parameter.
   */
  getActuatorBlueprint = (type: String) => {
    switch(type) {
      case "LIGHT_SINGLE":
      case "MOTOR_DC":
        return ActuatorBP_1pin_digital
      case "LIGHT_SINGLE_PWM":
      case "MOTOR_DC_PWM":
        return ActuatorBP_1pin_analog
      case "LIGHT_RGB":
        return ActuatorBP_3pin_rgb
      case "LIGHT_RGB_PWM":
        return ActuatorBP_3pin_rgb_pwm
      case "MOTOR_DC_H_BRIDGE":
        return ActuatorBP_3pin_dc_hbridge
      case "MOTOR_SERVO":
        return ActuatorBP_1pin_servo
      case "MOTOR_STEPPER_2":
        return ActuatorBP_2pin_stepper
      case "MOTOR_STEPPER_4":
        return ActuatorBP_4pin_stepper
    }
  }

  /**
   * Generate a string containing all the actuators macro, global variables,
   * data structures, etc.
   * Replaces keywords with the $ prefix.
   */
  getActuatorsDefs = () => {
    let allDefCode = ""
    this.actuators.forEach((act, actIndex) => {
      // For each actuator/channel
      // Get the definitions for this actuator
      let bp = this.getActuatorBlueprint(act.type)
      let actDef = this.actuatorDefs.find(a => a.type === act.type)
      if (actDef === undefined) throw new Error("No actuator definition found for type " + act.type)
      if (bp === undefined) throw new Error("No blueprint found for type " + act.type)

      let defCode = bp.definition
      .replace(/\$id/g, act.type + "_" + actIndex)
      .replace("$size", act.frames.length.toString())
      act.pins.forEach((pinValue, pinIndex) => {
        let re = new RegExp("\\$pin" + (pinIndex + 1), "g")
        defCode = defCode.replace(re, pinValue.toString())
      })
      act.constants.forEach((constValue, constIndex) => {
        let re = new RegExp("\\$const" + (constIndex + 1), "g")
        defCode = defCode.replace(re, constValue.toString())
      })
      // Generate frames for this actuator
      let frames = ""
      act.frames.forEach(frame => {
        let str = bp!.item
        str = str.replace("$start", frame.start.toString())
        str = str.replace("$end", frame.end.toString())
        frame.fields.forEach((fieldValue, fieldIndex) => {
          switch(actDef!.variables[fieldIndex].type) {
            case "NUMBER":
            default:
              str = str.replace("$var"+(fieldIndex+1), fieldValue.toString())
              break;
            case "BOOL":
              str = str.replace("$var"+(fieldIndex+1), fieldValue === "true" ? "HIGH" : "LOW")
              break;
            case "COLOR":
              let color = hexToRgb(fieldValue.replace("#", ""))
              str = str.replace("$var1", color.r.toString())
              str = str.replace("$var2", color.g.toString())
              str = str.replace("$var3", color.b.toString())
              break;
          }
        })
        frames += str + ","
      })
      defCode = defCode.replace("$array_values", frames)
      allDefCode += defCode + "\n"
    })

    return allDefCode
  }

  /**
   * Returns the setup code based on the blueprint of each actuator.
   */
  getActuatorsSetup = () => {
    let allSetupCode = ""
    this.actuators.forEach((act, actIndex) => {
      let bp = this.getActuatorBlueprint(act.type)
      if (bp === undefined) throw new Error("No blueprint found for type " + act.type)

      let setupCode = bp.setup
      .replace(/\$id/g, act.type + "_" + actIndex)

      act.pins.forEach((pinValue, pinIndex) => {
        let re = new RegExp("\\$pin" + (pinIndex + 1), "g")
        setupCode = setupCode.replace(re, pinValue.toString())
      })
      allSetupCode += setupCode
    })
    return allSetupCode
  }

  /**
   * Returns the loop code based on the blueprint of each actuator.
   */
  getActuatorsLoop = () => {
    let allLoopCode = ""
    this.actuators.forEach((act, actIndex) => {
      let bp = this.getActuatorBlueprint(act.type)
      if (bp === undefined) throw new Error("No blueprint found for type " + act.type)

      let loopCode = bp.loop
      .replace(/\$id/g, act.type + "_" + actIndex)

      allLoopCode += loopCode
    })
    return allLoopCode
  }
}

/**
 * Convert an HEX color string into an object containing the R, G, B values.
 */
// See https://stackoverflow.com/a/11508164
function hexToRgb(hex: string) {
  var bigint = parseInt(hex, 16)
  var r = (bigint >> 16) & 255
  var g = (bigint >> 8) & 255
  var b = bigint & 255

  return {r: r, g: g, b: b}
}