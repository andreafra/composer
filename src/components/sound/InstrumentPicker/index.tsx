import React from 'react'
import './style.css'
import { IChoiceGroupOption, ChoiceGroup, values } from '@fluentui/react'

function InstrumentPicker(props: any) {

  const instruments: OscillatorType[] = ["sine", "triangle", "square", "sawtooth" /*, "custom" */]
  // "custom" breaks the app, since it needs an appropriate initialization
  // See: https://developer.mozilla.org/en-US/docs/Web/API/PeriodicWave
  
  const setInstrument = (value: string) => {
    console.log(value)
    props.update(value)
  }

  const options: IChoiceGroupOption[] = [
    {
      key: 'sine',
      imageAlt: 'Sine icon',
      imageSrc: undefined,
      selectedImageSrc: undefined,
      imageSize: { width: 32, height: 32 },
      text: 'Sine Wave', // This text is long to show text wrapping.
    },
    {
      key: 'triangle',
      imageAlt: 'Triangle icon',
      imageSrc: undefined,
      selectedImageSrc: undefined,
      imageSize: { width: 32, height: 32 },
      text: 'Triangle Wave',
    },
    {
      key: 'square',
      imageAlt: 'Square icon',
      imageSrc: undefined,
      selectedImageSrc: undefined,
      imageSize: { width: 32, height: 32 },
      text: 'Square Wave',
    },
    {
      key: 'sawtooth',
      imageAlt: 'Sawtooth icon',
      imageSrc: undefined,
      selectedImageSrc: undefined,
      imageSize: { width: 32, height: 32 },
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
