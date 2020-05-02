import { ComposerState } from "types"
import soundReducer from "./soundReducer"
import channelReducer from "./channelReducer"
import { combineReducers } from "redux"
import systemReducer from "./systemReducer"

const rootReducer = combineReducers({
  system: systemReducer,
  sound: soundReducer,
  actuators: channelReducer
})

export default rootReducer