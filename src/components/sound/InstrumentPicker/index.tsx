import { ChoiceGroup, IChoiceGroupOption, IChoiceGroupStyles, IChoiceGroupOptionStyles } from '@fluentui/react'
import { SawtoothWave1, SineWave, SquareWave1, TriangleWave } from 'assets/images'
import React from 'react'
import './style.css'


function InstrumentPicker(props: any) {

  // "custom" breaks the app, since it needs an appropriate initialization
  // See: https://developer.mozilla.org/en-US/docs/Web/API/PeriodicWave
  
  const setInstrument = (value: string) => {
    console.log(value)
    props.update(value)
  }

  const IMAGE_SIZE = 32
  
  const options: IChoiceGroupOption[] = [
    {
      key: 'sine',
      // imageAlt: 'Sine icon',
      // imageSrc: SineWave,
      // selectedImageSrc: SineWave,
      // imageSize: { width: IMAGE_SIZE, height: IMAGE_SIZE },
      text: 'Sine Wave', // This text is long to show text wrapping.
    },
    {
      key: 'square',
      // imageAlt: 'Square icon',
      // imageSrc: SquareWave1,
      // selectedImageSrc: SquareWave1,
      // imageSize: { width: IMAGE_SIZE, height: IMAGE_SIZE },
      text: 'Square Wave',
    },
    {
      key: 'triangle',
      // imageAlt: 'Triangle icon',
      // imageSrc: TriangleWave,
      // selectedImageSrc: TriangleWave,
      // imageSize: { width: IMAGE_SIZE, height: IMAGE_SIZE },
      text: 'Triangle Wave',
    },
    {
      key: 'sawtooth',
      // imageAlt: 'Sawtooth icon',
      // imageSrc: SawtoothWave1,
      // selectedImageSrc: SawtoothWave1,
      // imageSize: { width: IMAGE_SIZE, height: IMAGE_SIZE },
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
