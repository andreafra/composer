import { ColorPicker, getColorFromString, IColor, Slider, Toggle } from "@fluentui/react";
import React from "react";
import { Field } from "types";

function FieldList(props: {
  value: string
  spec: Field
  update: (value: string) => void
}) {
  console.log(props.value, props.spec)

  const spec = props.spec
  switch (spec.type) {
    case "NUMBER":
      return <Slider
        label={spec.name}
        min={spec.minValue || 0}
        max={spec.maxValue || 100}
        step={1}
        value={parseInt(props.value) || 0}
        showValue={true}
        onChange={(value: number) => props.update(String(value))}
        snapToStep
      />
    case "COLOR":
      return <div>
        <h3>{spec.name}</h3>
        <ColorPicker
          color={getColorFromString(props.value)!}
          onChange={(e: any, colorObj: IColor) => props.update("#" + colorObj.hex)}
          showPreview={true}
          alphaType={"none"}
        />
      </div>
    case "BOOL":
      return <Toggle
        label={spec.name}
        defaultValue={parseInt(props.value) || 0}
        onText="On"
        offText="Off"
        onChange={(e, value) => props.update(value ? "1" : "0")} />
    default:
      return null
  }
  
}

export default FieldList