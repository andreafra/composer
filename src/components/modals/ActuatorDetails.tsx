import { getId, IconButton, ILayerProps, IStackTokens, Label, Modal, Stack, TextField, Dropdown, IDropdownOption, ITextField } from "@fluentui/react";
import { ActiveChannelCtx } from "components/actuators/ActuatorList";
import { DetailPanelCtx } from "components/App";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import shortid from "shortid";
import { Channel, ComposerState, Frame } from "types";
import { useActuatorModels } from "utils/actuatorModels";
import { contentStyles, iconButtonStyles } from "./styles";
import { type } from "os";

const stackTokens: IStackTokens = {
  childrenGap: 10,
}

export default function ActuatorDetails() {
  
  const detailPanel = React.useContext(DetailPanelCtx)
  const activeChannel = React.useContext(ActiveChannelCtx)

  const actuatorModels = useActuatorModels()

  const dispatch = useDispatch()
  const actuators = useSelector((state: ComposerState) => state.actuators)
  const _layerProps: ILayerProps = {
    onLayerDidMount: () => {}
  }

  const focusedChannels = actuators.filter(a => a.id === activeChannel.channelId)
  const focusedChannel = focusedChannels.length > 0 ? focusedChannels[0] : null

  const [actuatorIndex, setActuatorIndex] = useState(0)
  const [newActuator, setNewActuator]: [Channel, any] = useState({
    name: focusedChannel ? focusedChannel.name : `Actuator #${actuators.length + 1}`,
    id: activeChannel.channelId || shortid.generate(),
    type: focusedChannel ? focusedChannel.type : actuatorModels[0].type,
    pins: focusedChannel ? focusedChannel.pins : [],
    frames: focusedChannel ? focusedChannel.frames : new Map<string, Frame>()
  })

  const nameId = getId('nameInput');

  const options: IDropdownOption[] = actuatorModels.map((v, i) => {
    let item : IDropdownOption = {
      key: v.type,
      text: v.name
    }
    return item
  })

  const _generateActuatorFields = () => {
    let act = actuatorModels.find(a => a.type === newActuator.type)
    console.log(act)
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
    setNewActuator({
      ...newActuator,
      type: option.key
    })
  }

  // DEBUG
  useEffect(() => console.log(newActuator))

  return (
    <Modal
      titleAriaId={"file-picker-modal"}
      isOpen={detailPanel.value === "CHANNEL"}
      layerProps={_layerProps}
      onDismiss={() => detailPanel.changeValue("NONE")}
      isBlocking={false}
      containerClassName={contentStyles.container}
    >
      <div className={contentStyles.header}>
        <span id={"file-picker-title"}>Actuator Details</span>
        <IconButton
          styles={iconButtonStyles}
          iconProps={{ iconName: 'Cancel' }}
          ariaLabel="Close popup modal"
          onClick={() => detailPanel.changeValue("NONE")}
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
            label="Basic uncontrolled example"
            options={options}
            onChange={_handleTypeChange}
          />
          {_generateActuatorFields()}
        </Stack>
      </div>
    </Modal>
  )
}