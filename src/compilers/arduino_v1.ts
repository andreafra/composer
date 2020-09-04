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

const SOUND_PIN = "9";

export default class Compiler {
  options: EditorOptions
  sound: (SoundFrame | null)[]
  actuators: Channel[]
  actuatorDefs: Actuator[]

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

  build = () => {
    return this.header()
    + this.getSoundDefs()
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
  ${this.getSoundSetup()}
  ${this.getActuatorsSetup()}
}
`
  }

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

  getSoundDefs = () => {
    let notes = this.generateNotes()
    let code = SoundBlueprint.definition
    .replace("$pin", SOUND_PIN)
    .replace("$size", notes.size)
    .replace("$freq_array", notes.freq)
    .replace("$duration_array", notes.duration)
    return code
  }

  getSoundSetup = () => {
    return SoundBlueprint.setup
  }

  getSoundLoop = () => {
    return SoundBlueprint.loop
  }
  
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

// See https://stackoverflow.com/a/11508164
function hexToRgb(hex: string) {
  var bigint = parseInt(hex, 16)
  var r = (bigint >> 16) & 255
  var g = (bigint >> 8) & 255
  var b = bigint & 255

  return {r: r, g: g, b: b}
}