import { Field } from "types";
import { Checkbox, ColorPicker, IColorPickerStyles, getColorFromString, IColor } from "@fluentui/react";
import React, { useState } from "react";
import NumberField from "./NumberField";

export default function ActuatorField(
  props: {
    label: string,
    type: "COLOR" | "NUMBER" | "BOOL",
    value: any,
    minValue : number,
    maxValue : number,
    onChange: (newValue: any) => void
  }) {
  
  const [value, setValue] = useState(props.value)

  const _handleNumberChange = (newValue: number) => {
    setValue(newValue)
    props.onChange(newValue)
  }

  const _handleBoolChange = (ev: any, checked?: boolean) => {
    setValue(checked ? checked : false)
  }

  const _handleColorChange = (ev: any, color: IColor) => {
    setValue(color.str)
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
      checked={Boolean(value as boolean) || false}
      onChange={_handleBoolChange}
    />
    case "COLOR":
      return <ColorPicker
      color={getColorFromString("#" + value as string) as IColor || getColorFromString("#FF0000")}
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