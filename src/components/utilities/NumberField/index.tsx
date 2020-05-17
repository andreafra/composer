import { IButtonStyles, IconButton, ILabelStyles, ITextFieldStyles, Label, TextField } from "@fluentui/react";
import React, { useState } from "react";
import './style.css';

const narrowTextFieldStyles: Partial<ITextFieldStyles> = {
  fieldGroup: { width: 100 },
  root: { display: 'inline-block', }
}
const buttonStyle: IButtonStyles = {
  root: { display: 'inline-block' }
}
const labelStyle: ILabelStyles = {
  root: {
    display: 'inline-block',
    flexGrow: 1
  }
}
export default function NumberField(props: {
  defaultValue: number,
  minValue: number,
  maxValue: number,
  label: string,
  onChange: (value: number) => void 
}) {
  const [value, setValue] = useState(props.defaultValue)
  const minusIcon = { iconName: 'Remove' }
  const plusIcon = { iconName:  'Add' }

  const _handleDecrement = () => {
    let _newValue = value - 1
    validateAndSetValue(_newValue)
  }

  const _handleIncrement = () => {
    let _newValue = value + 1
    validateAndSetValue(_newValue)
  }

  const _handleChange = (value?: string) => {
    if (value && value !== '-' && !isNaN(parseInt(value)))
      validateAndSetValue(parseInt(value))
  }

  const validateAndSetValue = (value: number) => {
    if (value < props.minValue) value = props.minValue
    if (value > props.maxValue) value = props.maxValue

    setValue(value)
    props.onChange(value)
  }

  return (
    <div className={"NumberField"}>
      <Label
        styles={labelStyle}
      >{props.label}</Label>
      <IconButton
        iconProps={minusIcon} 
        title="Minus" 
        ariaLabel="Minus" 
        disabled={value <= props.minValue}
        styles={buttonStyle}
        onClick={_handleDecrement}
      />
      <TextField
        value={value.toString()}
        styles={narrowTextFieldStyles}
        onChange={(ev, value) => _handleChange(value)}
      />
      <IconButton
        iconProps={plusIcon} 
        title="Plus" 
        ariaLabel="Plus" 
        disabled={value >= props.maxValue}
        styles={buttonStyle}
        onClick={_handleIncrement}
      />
    </div>
  )
}