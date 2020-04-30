import * as type from 'types'

export const addNote = (payload: type.SoundFrame): type.NoteAction => ({
  type: type.ADD_NOTE,
  payload
})

export const removeNote = (index: number): type.NoteAction => ({
  type: type.REMOVE_NOTE,
  meta: {
    index
  }
})

export const updateNote = (payload: type.SoundFrame, index: number): type.NoteAction => ({
  type: type.UPDATE_NOTE,
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

export const addActuator = (payload: type.Actuator): type.ActuatorAction => ({
  type: type.ADD_ACTUATOR,
  payload
})

export const removeActuator = (name: string): type.ActuatorAction => ({
  type: type.REMOVE_ACTUATOR,
  meta: {
    name
  }
})

export const updateActuator = (payload: type.Actuator, name: string): type.ActuatorAction => ({
  type: type.UPDATE_ACTUATOR,
  payload,
  meta: {
    name
  }
})

export const addTimeline = (payload: type.Channel): type.TimelineAction => ({
  type: type.ADD_TIMELINE,
  payload
})

export const removeTimeline = (name: string): type.TimelineAction => ({
  type: type.REMOVE_TIMELINE,
  meta: {
    name
  }
})

export const updateTimeline = (payload: type.Channel): type.TimelineAction => ({
  type: type.UPDATE_TIMELINE,
  payload,
  meta: {
    name
  }
})

export const addFrame = (payload: type.Frame): type.FrameAction => ({
  type: type.ADD_FRAME,
  payload
})

export const removeFrame = (index: number): type.FrameAction => ({
  type: type.REMOVE_FRAME,
  meta: {
    index
  }
})

export const updateFrame = (payload: type.Frame, index: number): type.FrameAction => ({
  type: type.UPDATE_FRAME,
  payload,
  meta: {
    index
  }
})
