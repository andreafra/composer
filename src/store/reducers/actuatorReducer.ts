import {
  ADD_ACTUATOR,
  REMOVE_ACTUATOR,
  UPDATE_ACTUATOR,
  ActuatorAction,
  Actuator
} from 'types'

const initialState: Array<Actuator> = []

export default (
  state = initialState,
  action: ActuatorAction
) => {
  switch (action.type) {

  case ADD_ACTUATOR:
    return [...state, action.payload]

  case REMOVE_ACTUATOR:
    return state.reduce<Actuator[]>((res, elem) => {
      if(elem.name !== action.meta.name)
        res.push(elem)
      return res
    }, [])
  
  case UPDATE_ACTUATOR:
    return state.reduce<Actuator[]>((res, elem) => {
      if(elem.name === action.meta.name)
        res.push(action.payload)
      return res
    }, [])

  default:
    return state
  }
}
