import { combineReducers } from "redux"
import channelReducer from "./channelReducer"
import soundReducer from "./soundReducer"
import systemReducer from "./systemReducer"

const rootReducer = combineReducers({
  system: systemReducer,
  sound: soundReducer,
  actuators: channelReducer
})

export default rootReducer