/* Redux Action Type */
export const ADD_NOTE = 'ADD_NOTE'
export const REMOVE_NOTE = 'REMOVE_NOTE'
export const UPDATE_NOTE = 'EDIT_NOTE'

export const SET_VOLUME = 'SET_VOLUME'

export const ADD_ACTUATOR = 'ADD_ACTUATOR'
export const REMOVE_ACTUATOR = 'REMOVE_ACTUATOR'
export const UPDATE_ACTUATOR = 'UPDATE_ACTUATOR'

export const ADD_TIMELINE = 'ADD_TIMELINE'
export const REMOVE_TIMELINE = 'REMOVE_TIMELINE'
export const UPDATE_TIMELINE = 'UPDATE_TIMELINE'

export const ADD_FRAME = 'ADD_FRAME'
export const REMOVE_FRAME = 'REMOVE_FRAME'
export const UPDATE_FRAME = 'UPDATE_FRAME'

/* Actions */
interface AddNoteAction {
  type: typeof ADD_NOTE
  payload: SoundFrame
}

interface RemoveNoteAction {
  type: typeof REMOVE_NOTE
  meta: {
    index: number
  }
}

interface UpdateNoteAction {
  type: typeof UPDATE_NOTE
  payload: SoundFrame
  meta: {
    index: number
  }
}

export type NoteAction = AddNoteAction | RemoveNoteAction | UpdateNoteAction

interface SetVolumeAction {
  type: typeof SET_VOLUME
  payload: SoundFrame
  meta: {
    index: number
  }
}

export type VolumeAction = SetVolumeAction

export type SoundAction = NoteAction | VolumeAction

interface AddActuatorAction {
  type: typeof ADD_ACTUATOR
  payload: Actuator
}

interface RemoveActuatorAction {
  type: typeof REMOVE_ACTUATOR
  meta: {
    name: string
  }
}

interface UpdateActuatorAction {
  type: typeof UPDATE_ACTUATOR
  payload: Actuator
  meta: {
    name: string
  }
}

export type ActuatorAction = AddActuatorAction | RemoveActuatorAction | UpdateActuatorAction

interface AddTimelineAction {
  type: typeof ADD_TIMELINE
  payload: Channel
}

interface RemoveTimelineAction {
  type: typeof REMOVE_TIMELINE
  meta: {
    name: string
  }
}

interface UpdateTimelineAction {
  type: typeof UPDATE_TIMELINE
  payload: Channel
  meta: {
    name: string
  }
}

export type TimelineAction = AddTimelineAction | RemoveTimelineAction | UpdateTimelineAction

interface AddFrameAction {
  type: typeof ADD_FRAME
  payload: Frame
}

interface RemoveFrameAction {
  type: typeof REMOVE_FRAME
  meta: {
    index: number
  }
}

interface UpdateFrameAction {
  type: typeof UPDATE_FRAME
  payload: Frame
  meta: {
    index: number
  }
}

export type FrameAction = AddFrameAction | RemoveFrameAction | UpdateFrameAction

/* System */
export interface SystemState {
  username: string
  editorOptions: EditorOptions
}

export interface EditorOptions {
  leftPadding: number,
  resolution: number,
  width: number,
  frameSize: number
}

/* Composer */
export interface ComposerState {
  fileName: string
  sound: Array<SoundFrame | null>
  actuators: Actuator[]
}

/* Sound */

export interface SoundFrame {
  note: Note
  pitch: number
  volume: number
  type: OscillatorType
}

export interface Note {
  name: string
  freq: number
  octave: number
}

export interface Point {
  x: number
  y: number
}

/* Actuators */

export interface Actuator {
  name: string
  channels: Channel[]
}

export interface Channel {
  name: string
  pins: number[]
  frames: Frame[]
}

export interface Frame {
  color: string
  start: number
  end: number
}

export interface LightFrame extends Frame {
  lightColor: string
}
