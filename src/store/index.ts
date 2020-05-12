import { createStore, applyMiddleware } from 'redux'
import { Channel, Frame } from 'types'
import { addChannel, setFrame } from './actions'
import { composeWithDevTools, devToolsEnhancer } from 'redux-devtools-extension';
import root from './reducers/rootReducer'


export const store = createStore(
  root,
  devToolsEnhancer({})
)

// Log the initial state
console.log(store.getState())

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
const unsubscribe = store.subscribe(() => console.log(store.getState()))



// EXAMPLE
const sampleChannel: Channel = {
  name:"Test: 1 Rect",
  id: "xxxyyyzz",
  type: "LIGHT_RGB",
  pins: [1,2,3], 
  frames: new Map<string, Frame>()
}

store.dispatch(addChannel(sampleChannel))
store.dispatch(setFrame({
  id: "aaaaaaaa",
  channelId: "xxxyyyzz",
  color: "#ff0000",
  start: 1,
  end: 2,
  fields: ["#ff0000"]
}, "aaaaaaaa", "xxxyyyzz"))

unsubscribe()