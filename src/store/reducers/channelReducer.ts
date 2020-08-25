import { Channel, ChannelAction, REMOVE_CHANNEL, REMOVE_FRAME, SET_CHANNEL, SET_FRAME } from 'types';
import FileManager from 'utils/FileManager';

const latestFile = new FileManager().getLatestFile();

export const initialState: Array<Channel> = latestFile ? latestFile.actuators : []

export default (
  state = initialState,
  action: ChannelAction
) => {
  switch (action.type) {

  case REMOVE_CHANNEL:
    return state.reduce<Channel[]>((res, elem) => {
      if(elem.id !== action.meta.id)
        res.push(elem)
      return res
    }, [])
  
  case SET_CHANNEL:
    // TODO: Handle duplicate actuators
    let oldState = state.splice(0)
    oldState.push(action.payload)
    return oldState;

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
