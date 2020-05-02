import {
  ADD_CHANNEL,
  REMOVE_CHANNEL,
  UPDATE_CHANNEL,
  ChannelAction,
  Channel
} from 'types'

const initialState: Array<Channel> = []

export default (
  state = initialState,
  action: ChannelAction
) => {
  switch (action.type) {

  case ADD_CHANNEL:
    return [...state, action.payload]

  case REMOVE_CHANNEL:
    return state.reduce<Channel[]>((res, elem) => {
      if(elem.id !== action.meta.id)
        res.push(elem)
      return res
    }, [])
  
  case UPDATE_CHANNEL:
    return state.reduce<Channel[]>((res, elem) => {
      if(elem.id === action.meta.id)
        res.push(action.payload)
      return res
    }, [])

  default:
    return state
  }
}
