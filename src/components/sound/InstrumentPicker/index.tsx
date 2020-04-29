import React from 'react'
import './style.css'

function InstrumentPicker(props: any) {

  const instruments: OscillatorType[] = ["sine", "triangle", "square", "sawtooth" /*, "custom" */]
  // "custom" breaks the app, since it needs an appropriate initialization
  // See: https://developer.mozilla.org/en-US/docs/Web/API/PeriodicWave
  
  const setInstrument = (e: any) => {
    props.update(e.target.value)
  }

  const getInstrumentButtons = instruments.map(value =>
    <button
      className={"InstrumentButton " + (props.currentType === value ? "InstrumentButton-selected" : "")}
      key={value}
      value={value}
      onClick={e => setInstrument(e)}>{value}</button>
    )
  
  return (
    <ul>
      {getInstrumentButtons}
    </ul>
  )
}

export default InstrumentPicker
