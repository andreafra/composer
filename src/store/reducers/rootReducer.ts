import { ComposerState } from "types"
import soundReducer from "./soundReducer"
import actuatorReducer from "./actuatorReducer"

const initialState: ComposerState = {
  fileName: "Unnamed",
  sound: [],
  actuators: []
}

export default (
  state = initialState,
  action: any
) => {
  return  {
    fileName: "Unnamed",
    sound: soundReducer(state.sound, action),
    actuators: actuatorReducer(state.actuators, action)
  }
}
