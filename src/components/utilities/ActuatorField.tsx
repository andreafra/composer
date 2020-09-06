import { Checkbox, ColorPicker, getColorFromString, IColor, IColorPickerStyles } from "@fluentui/react";
import React, { useState } from "react";
import NumberField from "./NumberField";

/**
 * Adapts the input asked in the dialog windows 
 * for the type of actuator the user picked.
 */
export default function ActuatorField(
  props: {
    label: string,
    type: "COLOR" | "NUMBER" | "BOOL",
    value: any,
    minValue : number,
    maxValue : number,
    onChange: (newValue: string) => void
  }) {
  
  const [value, setValue] = useState(props.value)

  const _handleNumberChange = (newValue: number) => {
    setValue(String(newValue))
    props.onChange(String(newValue))
  }

  const _handleBoolChange = (ev: any, checked?: boolean) => {
    setValue(String(checked))
    props.onChange(String(checked))
  }

  const _handleColorChange = (ev: any, color: IColor) => {
    setValue(color.str)
    props.onChange(color.str)
  }

  switch (props.type) {
    case "NUMBER":
      return <NumberField
        label={props.label}
        defaultValue={parseInt(value) || 0}
        minValue={props.minValue}
        maxValue={props.maxValue}
        onChange={_handleNumberChange}
      />
    case "BOOL":
      return <Checkbox
      label={props.label}
      checked={value === "true"}
      onChange={_handleBoolChange}
    />
    case "COLOR":
      return <ColorPicker
      color={getColorFromString(value) as IColor || getColorFromString("#FF0000")}
      onChange={_handleColorChange}
      alphaType={"none"}
      showPreview={true}
      styles={colorPickerStyles}
    />
    default:
      return null
  }
}

const colorPickerStyles: Partial<IColorPickerStyles> = {
  panel: { padding: 12 },
  root: {
    maxWidth: 352,
    minWidth: 352,
  },
  colorRectangle: { height: 268 },
}