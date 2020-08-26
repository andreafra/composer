import { CombinedState, combineReducers } from "redux"
import { SET_COMPOSER } from "types"
import channelReducer from "./channelReducer"
import soundReducer from "./soundReducer"
import systemReducer from "./systemReducer"

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