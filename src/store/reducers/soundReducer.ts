import {
  SoundAction,
  SET_NOTE,
  REMOVE_NOTE,
  SET_VOLUME,
  SoundFrame
} from 'types'

export const initialState: Array<SoundFrame|null> = []

export default (
  state = initialState,
  action: SoundAction
) => {
  const newState = state.slice()
  switch (action.type) {
    
  case REMOVE_NOTE:
    newState.splice(action.meta.index, 1, null)
    return newState
  
  case SET_NOTE:
    newState.splice(action.meta.index, 1, action.payload)
    return newState
    
  case SET_VOLUME:
    newState.splice(action.meta.index, 1, action.payload)
    return newState
  default:
    return state
  }
}
