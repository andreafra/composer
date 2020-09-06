import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react'
import React from 'react'
import './style.css'

function InstrumentPicker(props: any) {

  // "custom" breaks the app, since it needs an appropriate initialization
  // See: https://developer.mozilla.org/en-US/docs/Web/API/PeriodicWave

  const setInstrument = (value: string) => {
    props.update(value)
  }
  
  const options: IChoiceGroupOption[] = [
    {
      key: 'sine',
      text: 'Sine Wave',
    },
    {
      key: 'square',
      text: 'Square Wave',
    },
    {
      key: 'triangle',
      text: 'Triangle Wave',
    },
    {
      key: 'sawtooth',
      text: 'Sawtooth Wave',
    },
  ];
  
  return (
    <ul>
      <ChoiceGroup 
        label="Select instrument" 
        defaultSelectedKey="sine" 
        options={options}
        onChange={(e: any, option?: IChoiceGroupOption) => setInstrument(option!.key || "sine")}
      />
    </ul>
  )
}

export default InstrumentPicker
