import { createStore } from 'redux'
import root from './reducers/rootReducer'
import { addChannel } from './actions'

import { Channel } from 'types'

export const store = createStore(root)

// Log the initial state
console.log(store.getState())

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
const unsubscribe = store.subscribe(() => console.log(store.getState()))



// EXAMPLE
const sampleChannel: Channel = {
  name:"Test: 1 Rect",
  id: "test-1-rect",
  type: "LIGHT",
  pins: [1], frames: {
      "aaa": {id: "Xfw53Sx", color: "red", start: 1, end: 2}
  }
}

store.dispatch(addChannel(sampleChannel))
