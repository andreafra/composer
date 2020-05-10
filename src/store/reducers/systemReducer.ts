import { SET_EDITOR_OPTIONS, SET_EDIT_PANEL_SCOPE, SET_EDIT_PANEL_VISIBILITY, SET_FILENAME, SET_USERNAME, SET_LEFT_SCROLL, SystemAction, SystemState } from 'types'

// The margin from the left side of the screen
const LEFT_PADDING = 30 // in px
// The total length of the track/song/whatever
const LENGTH = 5 // in seconds
// A single "frame", meaning a block on the timeline
const FRAME_RESOLUTION = 100 // in ms
const FRAME_SIZE = 30 // in px

const initialState: SystemState = {
  username: "Unknown",
  filename: "Unnamed File",
  editPanel: {
    visibility: false,
    scope: "SYSTEM"
  },
  editorOptions: {
    leftPadding: LEFT_PADDING,
    resolution: FRAME_RESOLUTION,
    width: LENGTH * 1000 / FRAME_RESOLUTION * FRAME_SIZE,
    frameSize: FRAME_SIZE,
    accentColor: "#666666",
    altAccentColor: "#999999"
  },
  leftScroll: 0
}

export default (
  state = initialState,
  action: SystemAction
) => {
  switch (action.type) {

  case SET_EDIT_PANEL_VISIBILITY:
    return {
      ...state,
      editPanel: {
        ...state.editPanel,
        visibility: action.visibile
      }
    }
  case SET_EDIT_PANEL_SCOPE:
    return {
      ...state,
      editPanel: {
        ...state.editPanel,
        scope: action.scope,
        channelId: action.meta.channelId,
        frameId: action.meta.frameId
      }
    }
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
