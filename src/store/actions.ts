import * as type from 'types'

export const removeNote = (index: number): type.NoteAction => ({
  type: type.REMOVE_NOTE,
  meta: {
    index
  }
})

export const setNote = (payload: type.SoundFrame, index: number): type.NoteAction => ({
  type: type.SET_NOTE,
  payload,
  meta: {
    index
  }
})

export const setVolume = (payload: type.SoundFrame, index: number): type.VolumeAction => ({
  type: type.SET_VOLUME,
  payload,
  meta: {
    index
  }
})

export const removeChannel = (id: string): type.ChannelAction => ({
  type: type.REMOVE_CHANNEL,
  meta: {
    id: id
  }
})

export const setChannel = (payload: type.Channel, id: string): type.ChannelAction => ({
  type: type.SET_CHANNEL,
  payload,
  meta: {
    id: id
  }
})

export const removeFrame = (id: string, channelId: string): type.FrameAction => ({
  type: type.REMOVE_FRAME,
  meta: {
    id: id,
    channelId: channelId
  }
})

export const setFrame = (payload: type.Frame, id: string, channelId: string): type.FrameAction => ({
  type: type.SET_FRAME,
  payload,
  meta: {
    id: id,
    channelId: channelId
  }
})

export const setUsername = (username: string): type.SystemAction => ({
  type: type.SET_USERNAME,
  username: username
})

export const setFilename = (filename: string): type.SystemAction => ({
  type: type.SET_FILENAME,
  filename: filename
})

export const setEditorOptions = (payload: type.EditorOptions): type.SystemAction => ({
  type: type.SET_EDITOR_OPTIONS,
  payload: payload
})

export const setState = (state: type.ComposerState): type.FileAction => ({
  type: type.SET_COMPOSER,
  payload: state
})