import { useSelector } from "react-redux"
import { ComposerState } from "types"
import { useActuatorModels } from "./actuatorModels"

/**
 * Optimises the JSON file for the user to download
 */
export function useJSONFilteredOutput() {
  const state = useSelector((state: ComposerState) => state)
  const actuatorTypes = useActuatorModels()

  const _width = state.system.editorOptions.width // in px
  const _frameWidth = state.system.editorOptions.frameSize // in px
  const _res = state.system.editorOptions.resolution // in ms
  const generate = () => {
    const _output = {
      // file name
      fileName: state.system.filename, 
      // file duration in ms
      fileDuration: _width / _frameWidth * _res,
      // frame duration in ms
      frameDuration: _res,
      // condensed data
      data: {
        notes: new Array<IOutputSound>(),
        actuators: new Array<IOutputActuator>()
      }
    }

    // Iterate sound frames
    state.sound.forEach((frame, index) => {
      if (frame) {
        const _frame: IOutputSound = {
          freq: frame.note.freq || 0,
          type: frame.type,
          volume: frame.volume,
          time: index
        }
        _output.data.notes.push(_frame)
      }
    })

    // Iterate actuators
    state.actuators.forEach((actuator, index) => {
      if (actuator) {
        const _actuator: IOutputActuator = {
          pins: actuator.pins,
          type: actuator.type,
          frames: new Array<IOutputActuatorFrame>()
        }

        // Get the type of each field this actuator can have from reference.
        const _fieldTypes = actuatorTypes.find(v => v.type === actuator.type)

        // Iterate frames
        actuator.frames.forEach((frame, index) => {
          const _frame: IOutputActuatorFrame = {
            start: frame.start,
            end: frame.end,
            fields: new Array<IOutputActuatorField>()
          }

          // For each frame, iterate its fields
          frame.fields.forEach((field, index) => {
            const _field: IOutputActuatorField = {
              type: _fieldTypes?.variables[index].type || "UNKNOWN",
              value: field
            }

            _frame.fields.push(_field)
          })

          _actuator.frames.push(_frame)
        })

        _output.data.actuators.push(_actuator)
      }
    })
      console.log("Generated filtered JSON")
      return JSON.stringify(_output)
  }
  
  return generate
}

interface IOutput {
  fileName: string
  frameDuration: number
  fileDuration: number
  data: {
    notes: IOutputSound[]
    actuators: IOutputActuator[]
  }
}

interface IOutputSound {
  freq: number
  volume: number
  time: number
  type: OscillatorType
}

interface IOutputActuator {
  pins: number[]
  type: string
  frames: IOutputActuatorFrame[]
}

interface IOutputActuatorFrame {
  start: number
  end: number
  fields: IOutputActuatorField[]
}

interface IOutputActuatorField {
  type: string
  value: string
}
