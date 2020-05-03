import { Actuator } from "types"

let availableActuators: Actuator[] = []

export function initDefaultActuators() {
  // Defaults
  defaultActuators.forEach((a: Actuator) => {
    availableActuators.push(a)
  })
}

export function initCustomActuators(source: Actuator[]) {
  // Add from parameter
  source.forEach((actuator: object) => {
    if (verifyActuator(actuator))
      availableActuators.push(actuator as Actuator)
  })
}

function verifyActuator(object: any): object is Actuator {
  let _obj = object as Actuator
  return _obj.type !== undefined && typeof _obj.type === "string" &&
    _obj.name !== undefined && typeof _obj.name === "string" &&
    _obj.pins !== undefined && typeof _obj.pins === "object" &&
    _obj.fields !== undefined && typeof _obj.fields === "object"
}

export function useCustomActuators() {
  return availableActuators
}

const defaultActuators: Actuator[] = [
  {
    type: "LIGHT_RGB",
    name: "Light (RGB)",
    pins: ["R", "G", "B"],
    fields: [
      {
        type: "COLOR",
        name: "Color"
      }
    ]
  },
  {
    type: "LIGHT_SINGLE",
    name: "Light (Single Led)",
    pins: ["Power"],
    fields: [
      {
        type: "NUMBER",
        name: "Intensity",
        minValue: 0,
        maxValue: 100
      }
    ]
  },
  {
    type: "MOTOR_DC",
    name: "DC Motor",
    pins: ["Power"],
    fields: [
      {
        type: "NUMBER",
        name: "Speed",
        minValue: 0,
        maxValue: 100
      },
      {
        type: "BOOL",
        name: "Reverse"
      }
    ]
  },
  {
    type: "MOTOR_SERVO",
    name: "Servo Motor",
    pins: ["Control"],
    fields: [
      {
        type: "NUMBER",
        name: "Angle",
        minValue: 0,
        maxValue: 180
      }
    ]
  }
]