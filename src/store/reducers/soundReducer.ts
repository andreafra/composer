import {
  SoundAction,
  ADD_NOTE,
  REMOVE_NOTE,
  UPDATE_NOTE,
  SET_VOLUME,
  SoundFrame
} from 'types'

const initialState: Array<SoundFrame|null> = []

export default (
  state = initialState,
  action: SoundAction
) => {
  const newState = state.slice()
  switch (action.type) {

  case ADD_NOTE:
    return [...state, action.payload]

  case REMOVE_NOTE:
    newState.splice(action.meta.index, 1, null)
    return newState
  
  case UPDATE_NOTE:
    newState.splice(action.meta.index, 1, action.payload)
    return newState
  case SET_VOLUME:
    newState.splice(action.meta.index, 1, action.payload)
    return newState
  default:
    return state
  }
}
