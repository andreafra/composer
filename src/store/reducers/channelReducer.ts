import { Channel, ChannelAction, REMOVE_CHANNEL, REMOVE_FRAME, SET_CHANNEL, SET_FRAME } from 'types';
import FileManager from 'utils/FileManager';

const latestFile = new FileManager().getLatestFile();

export const initialState: Array<Channel> = latestFile ? latestFile.actuators : []

export default (
  state = initialState,
  action: ChannelAction
) => {
  let stateCopy = state.slice()
  switch (action.type) {
  case REMOVE_CHANNEL:
    return stateCopy.filter(i => i.id !== action.meta.id)
  
  case SET_CHANNEL:
    let channelIndex = stateCopy.findIndex(ch => ch.id === action.meta.id)
    if (channelIndex > -1)
      stateCopy[channelIndex] = action.payload
    else
      stateCopy.push(action.payload)
    return stateCopy

  case SET_FRAME:
    stateCopy.forEach(ch => {
      if (ch.id === action.meta.channelId) {
        let frame = ch.frames.find(fr => fr.id === action.meta.id)
        if (frame) {
          ch.frames[ch.frames.indexOf(frame)] = action.payload
        } else {
          ch.frames.push(action.payload)
        }
      }
    })
    return stateCopy

  case REMOVE_FRAME:
    stateCopy.forEach(ch => {
      if (ch.id === action.meta.channelId) {
        ch.frames = ch.frames.filter(fr => fr.id !== action.meta.id)
      }
    })
    return stateCopy
  
  default:
    return state
  }
}
