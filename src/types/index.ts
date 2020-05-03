/* Redux Action Type */
export const SET_NOTE = 'EDIT_NOTE'
export const REMOVE_NOTE = 'REMOVE_NOTE'

export const SET_VOLUME = 'SET_VOLUME'

export const ADD_CHANNEL = 'ADD_CHANNEL'
export const REMOVE_CHANNEL = 'REMOVE_CHANNEL'
export const UPDATE_CHANNEL = 'UPDATE_CHANNEL'

export const SET_FRAME = 'SET_FRAME'
export const REMOVE_FRAME = 'REMOVE_FRAME'

/* System */
export const SET_EDIT_PANEL_VISIBILITY = 'SET_EDIT_PANEL_VISIBILITY'
export const SET_EDIT_PANEL_SCOPE = 'SET_EDIT_PANEL_SCOPE'
export const SET_USERNAME = 'SET_USERNAME'
export const SET_FILENAME = 'SET_FILENAME'
export const SET_EDITOR_OPTIONS = 'SET_EDITOR_OPTIONS'

/* Dictionary */
export interface IDictionary<V> {
  [index: string]: V
}

/* Actions */

interface RemoveNoteAction {
  type: typeof REMOVE_NOTE
  meta: {
    index: number
  }
}

interface SetNoteAction {
  type: typeof SET_NOTE
  payload: SoundFrame
  meta: {
    index: number
  }
}

export type NoteAction = RemoveNoteAction | SetNoteAction

interface SetVolumeAction {
  type: typeof SET_VOLUME
  payload: SoundFrame
  meta: {
    index: number
  }
}

export type VolumeAction = SetVolumeAction

export type SoundAction = NoteAction | VolumeAction

interface AddChannelAction {
  type: typeof ADD_CHANNEL
  payload: Channel
}

interface RemoveChannelAction {
  type: typeof REMOVE_CHANNEL
  meta: {
    id: string
  }
}

interface UpdateChannelAction {
  type: typeof UPDATE_CHANNEL
  payload: Channel
  meta: {
    id: string
  }
}

interface RemoveFrameAction {
  type: typeof REMOVE_FRAME
  meta: {
    id: string
    channelId: string
  }
}

interface SetFrameAction {
  type: typeof SET_FRAME
  payload: Frame
  meta: {
    id: string
    channelId: string
  }
}

export type FrameAction = SetFrameAction | RemoveFrameAction
export type ChannelAction = AddChannelAction | RemoveChannelAction | UpdateChannelAction | FrameAction

interface SetEditPanelVisibilityAction {
  type: typeof SET_EDIT_PANEL_VISIBILITY
  visibile: boolean
}

interface SetEditPanelScopeAction {
  type: typeof SET_EDIT_PANEL_SCOPE
  scope: string
  meta: {
    channelId: string
    frameId?: string
  }
}

export type SetEditPanelAction = SetEditPanelVisibilityAction | SetEditPanelScopeAction

interface SetUsernameAction {
  type: typeof SET_USERNAME
  username: string
}

interface SetFilenameAction {
  type: typeof SET_FILENAME
  filename: string
}

interface SetEditorOptionsAction {
  type: typeof SET_EDITOR_OPTIONS
  payload: EditorOptions
}

export type SystemAction = SetEditPanelAction | SetUsernameAction | SetFilenameAction | SetEditorOptionsAction

/* System */
export interface SystemState {
  username: string
  filename: string
  editPanel: EditPanelState
  editorOptions: EditorOptions
}

export interface EditPanelState {
  scope: PanelScope
  visibility: boolean
  channelId?: string
  frameId?: string
}

export interface EditorOptions {
  leftPadding: number,
  resolution: number,
  width: number,
  frameSize: number
}

/* Composer */
export interface ComposerState {
  system: SystemState
  sound: Array<SoundFrame | null>
  actuators: Array<Channel>
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
export interface Channel {
  name: string
  id: string
  type: string
  pins: number[]
  frames: Map<string, Frame>
}

export interface Frame {
  id: string
  channelId: string
  color: string
  start: number
  end: number
  fields: Array<string>
}

/* Panel Types */

export type PanelScope = "SYSTEM" | "ACTUATOR" | "FRAME"

/* Custom Actuators */
export interface Field {
  type: "COLOR" | "NUMBER" | "BOOL"
  name: string
  minValue?: number
  maxValue?: number
}

export interface Actuator {
  type: string
  name: string
  pins: string[]
  fields: Field[]
}