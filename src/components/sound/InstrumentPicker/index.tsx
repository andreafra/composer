import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react'
import React from 'react'
import './style.css'

/**
 * The IstrumentPicker is a DropDown in the Sound bar
 * where the User can pick from Sine, Square, Triangle, Sawtooth waves. 
 */

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
