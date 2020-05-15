import { useCustomActuators } from "utils/defaultActuators"
import { useSelector, useDispatch } from "react-redux"
import { ComposerState, Channel, Frame, Actuator } from "types"
import React, { useState } from "react"
import { getId, Stack, Label, TextField, Dropdown, IDropdownOption, PrimaryButton, IStackTokens } from "@fluentui/react"
import shortid from "shortid"
import { addChannel, setEditPanelVisibility } from "store/actions"

import Pins from './pins'

const StackTokens: Partial<IStackTokens> = { childrenGap: 10 };

function ActuatorConfig() {
  const actuators = useCustomActuators()
  const numOfActuators = useSelector((state: ComposerState) => state.actuators).length
  const channelId = useSelector((state: ComposerState) => state.system.editPanel.channelId)

  const [actuatorName, setActuatorName] = useState(`Actuator #${numOfActuators + 1}`)
  const [showDetails, setShowDetails] = useState(false)
  const [actuatorIndex, setActuatorIndex] = useState(0)
  const [addBtnDisabled, setAddBtnDisabled] = useState(false)

  const dispatch = useDispatch()

  const nameId = getId('nameInput');

  const actuator = actuators[actuatorIndex]

  /**
   * The new item to create
   */
  let newActuator: Channel = {
    name: actuatorName,
    id: channelId || shortid.generate(),
    type: actuator.type,
    pins: [],
    frames: new Map<string, Frame>()
  }

  const _handleActuatorTypeOption = (index?: number) => {
    if (index !== undefined && index >= 0) {
      setShowDetails(true)
      setActuatorIndex(index)
    }
  }

  const _handlePinUpdate = (value: number[]) => {
    newActuator.pins = value
  }

  const _addActuator = () => {
    dispatch(addChannel(newActuator))
    dispatch(setEditPanelVisibility(false))
  }

  return <Stack tokens={StackTokens}>
    <Label htmlFor={nameId}>Actuator name</Label>
    <TextField
      placeholder={newActuator.name}
      onChange={(ev, value) => setActuatorName(value || actuatorName)}
      id={nameId}
    />
    <Dropdown
      placeholder="Select an actuator type"
      label="Actuator type"
      options={actuators.map((a: Actuator) => {return {key: a.type, text: a.name}}) as IDropdownOption[]}
      onChange={(
        e: React.FormEvent<HTMLDivElement>,
        option?: IDropdownOption,
        index?: number) => _handleActuatorTypeOption(index)
      }
    />
    {showDetails && actuator
    ? <Stack tokens={StackTokens}>
        <Pins actuator={actuator} update={_handlePinUpdate} />
        <PrimaryButton text="Add Actuator" onClick={_addActuator} allowDisabledFocus disabled={addBtnDisabled} />
      </Stack>
    : null
    }
  </Stack>
}

export default ActuatorConfig