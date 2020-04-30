import {
  ADD_TIMELINE,
  REMOVE_TIMELINE,
  UPDATE_TIMELINE,
  TimelineAction,
  Channel
} from 'types'

const initialState: Array<Channel> = []

export default (
  state = initialState,
  action: TimelineAction
) => {
  switch (action.type) {

  case ADD_TIMELINE:
    return [...state, action.payload]

  case REMOVE_TIMELINE:
    return state.reduce<Channel[]>((res, elem) => {
      if(elem.name !== action.meta.name)
        res.push(elem)
      return res
    }, [])
  
  case UPDATE_TIMELINE:
    return state.reduce<Channel[]>((res, elem) => {
      if(elem.name === action.meta.name)
        res.push(action.payload)
      return res
    }, [])

  default:
    return state
  }
}
