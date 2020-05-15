import { Actuator } from "types"
import React, { useState } from "react"
import { SpinButton, Stack, IStackTokens } from "@fluentui/react"

const StackTokens: Partial<IStackTokens> = { childrenGap: 10 };

function PinList(props: {
  actuator: Actuator,
  update: (value: number[]) => void
}) {
  const actuator = props.actuator

  const [pinValue, setPinValue]: [number[], any] = useState([])
  const [hasDuplicates, setHasDuplicates] = useState(false)

  const _handlePinIncrease = (value: string, index: number) => {
    const _num = parseInt(value)
    const _pins = pinValue.splice(0);
    _pins[index] = _num < 100? _num + 1 : 100
    setPinValue(_pins)
    props.update(pinValue)
  }

  const _handlePinDecrease = (value: string, index: number) => {
    const _num = parseInt(value)
    const _pins = pinValue.splice(0);
    _pins[index] = _num > 0 ? _num - 1 : 0
    setPinValue(_pins)
    props.update(pinValue)
  }

  const pins = actuator.pins.map((value, index) =>
    <SpinButton
      key={value}
      value={String(pinValue[index] || 0)}
      label={value}
      min={0}
      max={100}
      step={1}
      onIncrement={(value) => _handlePinIncrease(value, index)}
      onDecrement={(value) => _handlePinDecrease(value, index)}
      incrementButtonAriaLabel={'Increase value by 1'}
      decrementButtonAriaLabel={'Decrease value by 1'}
      iconProps={{ iconName: 'PlugConnected' }}
    />
  )

  return <>
    <Stack tokens={StackTokens}>
      {pins}
    </Stack>
  </>
}

export default PinList