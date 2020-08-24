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
    else console.error("Invalid Actuator!")
  })
}

function verifyActuator(object: any): object is Actuator {
  let _obj = object as Actuator
  return _obj.type !== undefined && typeof _obj.type === "string" &&
    _obj.name !== undefined && typeof _obj.name === "string" &&
    _obj.pins !== undefined && typeof _obj.pins === "object" &&
    _obj.variables !== undefined && typeof _obj.variables === "object"
}

export function useActuatorModels() {
  return availableActuators
}

const defaultActuators: Actuator[] = [
  {
    type: "LIGHT_SINGLE",
    name: "Light (Single Led)",
    pins: ["Power"],
    variables: [
      {
        type: "BOOL",
        name: "On/Off"
      }
    ]
  },
  {
    type: "LIGHT_SINGLE_PWM",
    name: "Light (Single Led. PWM)",
    pins: ["Power"],
    variables: [
      {
        type: "NUMBER",
        name: "Intensity"
      }
    ]
  },
  {
    type: "LIGHT_RGB",
    name: "Light (RGB)",
    pins: ["R", "G", "B"],
    variables: [
      {
        type: "BOOL",
        name: "Red"
      },
      {
        type: "BOOL",
        name: "Green"
      },
      {
        type: "BOOL",
        name: "Blue"
      }
    ]
  },
  {
    type: "LIGHT_RGB_PWM",
    name: "Light (RGB, PWM)",
    pins: ["R", "G", "B"],
    variables: [
      {
        type: "COLOR",
        name: "Color"
      }
    ]
  },
  {
    type: "MOTOR_DC",
    name: "DC Motor",
    pins: ["Power"],
    variables: [
      {
        type: "NUMBER",
        name: "Speed",
        minValue: 0,
        maxValue: 100
      }
    ]
  },
  {
    type: "MOTOR_DC_PWM",
    name: "DC Motor (PWM)",
    pins: ["Power"],
    variables: [
      {
        type: "NUMBER",
        name: "Speed",
        minValue: 0,
        maxValue: 100
      }
    ]
  },
  {
    type: "MOTOR_DC_H_BRIDGE",
    name: "DC Motor (H Bridge)",
    pins: ["Speed (PWM)", "Input 1", "Input 2"],
    variables: [
      {
        type: "NUMBER",
        name: "Speed",
        minValue: 0,
        maxValue: 100
      },
      {
        type: "BOOL",
        name: "Input 1"
      },
      {
        type: "BOOL",
        name: "Input 2"
      }
    ]
  },
  {
    type: "MOTOR_SERVO",
    name: "Servo Motor",
    pins: ["Control"],
    variables: [
      {
        type: "NUMBER",
        name: "Angle",
        minValue: 0,
        maxValue: 180
      }
    ]
  },
  {
    type: "MOTOR_STEPPER_2",
    name: "Stepper Motor (2 Pins)",
    pins: ["Pin 1", "Pin 2"],
    variables: [
      {
        type: "NUMBER",
        name: "Speed (RPM)",
        minValue: 0,
        maxValue: 1000
      },
      {
        type: "NUMBER",
        name: "Speed (RPM)",
        minValue: 0,
        maxValue: 100
      }
    ]
  },
  {
    type: "MOTOR_STEPPER_4",
    name: "Stepper Motor (4 Pins)",
    pins: ["Pin 1", "Pin 2", "Pin 3", "Pin 4"],
    constants: [
      {
        type: "NUMBER",
        name: "Steps",
        minValue: 0,
        maxValue: 1000
      }
    ],
    variables: [
      {
        type: "NUMBER",
        name: "Speed (RPM)",
        minValue: 0,
        maxValue: 1000
      },
      {
        type: "NUMBER",
        name: "Steps",
        minValue: 0,
        maxValue: 100
      }
    ]
  }
]