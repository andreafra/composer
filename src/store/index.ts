import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import root from './reducers/rootReducer';

export const store = createStore(
  root,
  devToolsEnhancer({})
)

// Log the initial state
console.log(store.getState())
