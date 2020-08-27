import { SET_EDITOR_OPTIONS, SET_FILENAME, SET_LEFT_SCROLL, SET_USERNAME, SystemAction, SystemState } from 'types'
import FileManager from 'utils/FileManager'

// The total length of the track/song/whatever
const LENGTH = 5 // in seconds
// A single "frame", meaning a block on the timeline
const FRAME_RESOLUTION = 100 // in ms
const FRAME_SIZE = 30 // in px

const latestFile = new FileManager().getLatestFile();

export const defaultState: SystemState = {
  username: "Unknown",
  lastModified: new Date(),
  filename: "Unnamed File",
  editorOptions: {
    resolution: FRAME_RESOLUTION,
    width: LENGTH * 1000 / FRAME_RESOLUTION * FRAME_SIZE,
    frameSize: FRAME_SIZE
  },
}

export const initialState: SystemState = latestFile ? latestFile.system : defaultState

export default (
  state = initialState,
  action: SystemAction
) => {
  switch (action.type) {
  case SET_USERNAME:
    return {
      ...state,
      username: action.username
    }
  case SET_FILENAME:
    return {
      ...state,
      filename: action.filename
    }
  case SET_EDITOR_OPTIONS:
    return {
      ...state,
      editorOptions: action.payload
    }
  case SET_LEFT_SCROLL:
    return {
      ...state,
      leftScroll: action.scroll
    }
  default:
    return state
  }
}
