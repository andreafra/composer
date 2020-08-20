import { combineReducers, CombinedState } from "redux"
import channelReducer from "./channelReducer"
import soundReducer from "./soundReducer"
import systemReducer from "./systemReducer"
import { SET_COMPOSER, SystemAction, FileAction, ChannelAction, SoundAction } from "types"

// const rootReducer = combineReducers({
//   system: systemReducer,
//   sound: soundReducer,
//   actuators: channelReducer
// })

// export default rootReducer

const appReducer = combineReducers({
  system: systemReducer,
  sound: soundReducer,
  actuators: channelReducer
})


const rootReducer = (state: CombinedState<any>, action: any) => {
  if (action.type === SET_COMPOSER) {
    state = action.payload
  }

  return appReducer(state, action)
}
export default rootReducer