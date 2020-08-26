import { Dropdown, getId, IconButton, IDropdownOption, ILayerProps, IStackTokens, Label, Modal, PrimaryButton, Stack, TextField } from "@fluentui/react";
import { DetailPanelCtx } from "components/App";
import ActuatorField from "components/utilities/ActuatorField";
import NumberField from "components/utilities/NumberField";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChannel } from "store/actions";
import { Channel, ComposerState } from "types";
import { useActuatorModels } from "utils/actuatorModels";
import { contentStyles, iconButtonStyles } from "./styles";

export default function ActuatorDetails(props: {
  activeChannelId: string,
  show: boolean,
  onDismiss: () => void
}) {
  
  const detailPanel = React.useContext(DetailPanelCtx)

  const actuatorModels = useActuatorModels()

  const dispatch = useDispatch()
  const actuators = useSelector((state: ComposerState) => state.actuators)
  
  const focusedChannel = actuators.find(a => a.id === props.activeChannelId)

  const defaultActuator: Channel = {
    name: `Actuator #${actuators.length + 1}`,
    id: props.activeChannelId,
    type: actuatorModels[0].type,
    pins: [],
    frames: [],
    constants: []
  }

  const [isDisabled, setIsDisabled]: [boolean, any] = useState(true)
  const [newActuator, setNewActuator]: [Channel, any] = useState(defaultActuator)

  const nameId = getId('nameInput');

  const options: IDropdownOption[] = actuatorModels.map((v, i) => {
    let item : IDropdownOption = {
      key: v.type,
      text: v.name
    }
    return item
  })

  const _layerProps: ILayerProps = {
    onLayerDidMount: () => {
      setNewActuator(focusedChannel ? focusedChannel : defaultActuator)
    }
  }

  const _generateActuatorFields = () => {
    let act = actuatorModels.find(a => a.type === newActuator.type)
    if (!act) return null
    let items = []
    // Add pins
    items.push(act.pins.map((value, index) => <NumberField
      defaultValue={0}
      minValue={0}
      maxValue={255}
      label={value}
      onChange={v => _handlePinChange(index, v)}
    />))
    // Add constants
    if (act.constants) {
      items.push(act.constants?.map((value, index) => <ActuatorField
        label={value.name}
        type={value.type}
        value={newActuator.constants ? newActuator.constants[index] : undefined }
        minValue={value.minValue || 0}
        maxValue={value.maxValue || 100}
        onChange={v => _handleConstantChange(index, v)}
      />))
    }

    return items
  }

  const _handleNameChange = (event: any, newValue?: string) => {
    if (newValue === undefined) return;
    setNewActuator({
      ...newActuator,
      name: newValue
    })
  }

  const _handleTypeChange = (event: any, option?: IDropdownOption) => {
    if (option === undefined) return;
    let act = actuatorModels.find(a => a.type === newActuator.type)
    if (act) {
      setNewActuator({
        ...newActuator,
        type: option.key,
        pins: [],
        constants: []
      })
    } else console.error("Couldn't find matching model for actuator " + option.key)
  }

  const _handlePinChange = (index: number, newValue: number) => {
    let currentPins = newActuator.pins
    currentPins[index] = newValue ? newValue : 0
    setNewActuator({
      ...newActuator,
      pins: currentPins
    })
  }

  const _handleConstantChange = (index: number, newValue: any) => {
    let currentConst = newActuator.constants
    currentConst[index] = newValue ? newValue : 0
    setNewActuator({
      ...newActuator,
      constants: currentConst
    })
  }

  const _handleSetChannel = () => {
    // update the state
    dispatch(setChannel(newActuator, newActuator.id))
    // close the modal
    _handleDismiss()
  }

  const _handleDismiss = () => {
    props.onDismiss()
    detailPanel.changeValue("NONE")
  }

  const verifyConditions = () => {
    let act = actuatorModels.find(a => a.type === newActuator.type)
    if (act) {
      if ( newActuator.name && newActuator.name !== ""
        && newActuator.pins.length === act.pins.length
        && (newActuator.constants.length === act.constants?.length || !act.constants)
      ) {
        setIsDisabled(false)
        return
      }
    }
    setIsDisabled(true)
  }

  // DEBUG
  useEffect(() => {
    verifyConditions()
  })

  return (
    <Modal
      titleAriaId={"file-picker-modal"}
      isOpen={props.show && detailPanel.value === "CHANNEL"}
      layerProps={_layerProps}
      onDismiss={_handleDismiss}
      isBlocking={false}
      containerClassName={contentStyles.container}
    >
      <div className={contentStyles.header}>
        <span id={"file-picker-title"}>Actuator Details</span>
        <IconButton
          styles={iconButtonStyles}
          iconProps={{ iconName: 'Cancel' }}
          ariaLabel="Close popup modal"
          onClick={_handleDismiss}
        />
      </div>
      <div className={contentStyles.body}>
        <Stack tokens={stackTokens}>
          <Label htmlFor={nameId}>Actuator name</Label>
          <TextField
            placeholder={newActuator.name}
            errorMessage={newActuator.name === "" ? "Insert a name" : undefined}
            onChange={_handleNameChange}
            id={nameId}
          />
          <Dropdown
            placeholder="Select an option"
            label="Select actuator type"
            options={options}
            onChange={_handleTypeChange}
            defaultSelectedKey={newActuator.type || actuatorModels[0].type}
          />
          {_generateActuatorFields()}
          {isDisabled ? (<p>Try update the pin values again if the button is disabled.</p>) : null}
          <PrimaryButton text="Set Actuator" onClick={_handleSetChannel} allowDisabledFocus disabled={isDisabled} />
        </Stack>
      </div>
    </Modal>
  )
}

const stackTokens: IStackTokens = {
  childrenGap: 10,
}