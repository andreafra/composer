import { ADD_CHANNEL, Channel, ChannelAction, REMOVE_CHANNEL, REMOVE_FRAME, SET_FRAME, UPDATE_CHANNEL } from 'types'

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

  case SET_FRAME:
    return state.slice(0).reduce<Channel[]>((res, elem) => {
      if(elem.id === action.meta.channelId)
        elem.frames.set(action.payload.id, action.payload)
        res.push(elem)
      return res
    }, [])
  
  case REMOVE_FRAME:
    return state.slice(0).reduce<Channel[]>((res, elem) => {
      if(elem.id === action.meta.channelId)
        elem.frames.delete(action.meta.id)
        res.push(elem)
      return res
    }, [])
  
  default:
    return state
  }
}
