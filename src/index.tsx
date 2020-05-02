import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './index.css'
import App from './components/App'
import * as serviceWorker from './serviceWorker'

import { initializeIcons } from '@fluentui/react/lib/Icons';
import {loadTheme} from '@fluentui/react'

import {store} from 'store'
import { initDefaultActuators } from 'types/defaultActuators'

initializeIcons()

// Load custom theme for Fluent UI
loadTheme({
  palette: {
    themePrimary: '#d6226d',
    themeLighterAlt: '#fdf5f8',
    themeLighter: '#f8d7e5',
    themeLight: '#f3b6cf',
    themeTertiary: '#e772a3',
    themeSecondary: '#db397d',
    themeDarkAlt: '#c11f62',
    themeDark: '#a31a53',
    themeDarker: '#78133d',
    neutralLighterAlt: '#f8f8f8',
    neutralLighter: '#f4f4f4',
    neutralLight: '#eaeaea',
    neutralQuaternaryAlt: '#dadada',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c8c8',
    neutralTertiary: '#595959',
    neutralSecondary: '#373737',
    neutralPrimaryAlt: '#2f2f2f',
    neutralPrimary: '#000000',
    neutralDark: '#151515',
    black: '#0b0b0b',
    white: '#ffffff',
  }
})

initDefaultActuators()

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
