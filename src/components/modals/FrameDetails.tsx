import { IconButton, ILayerProps, IStackTokens, Modal, PrimaryButton, Stack } from "@fluentui/react";
import { DetailPanelCtx } from "components/App";
import ActuatorField from "components/utilities/ActuatorField";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFrame } from "store/actions";
import { ComposerState, Frame } from "types";
import { useActuatorModels } from "utils/actuatorModels";
import { contentStyles, iconButtonStyles } from "./styles";

export default function FrameDetails(props: {
  activeChannelId: string,
  activeFrameId: string,
  onDismiss: () => void
}) {
  
  const detailPanel = React.useContext(DetailPanelCtx)

  const actuatorModels = useActuatorModels()

  const dispatch = useDispatch()
  const actuators = useSelector((state: ComposerState) => state.actuators)
  
  const defaultFrame: Frame = {
    id: props.activeFrameId,
    channelId: props.activeChannelId,
    fields: [],
    color: "#FF0000",
    start: 0,
    end: 0
  }

  const [isDisabled, setIsDisabled]: [boolean, any] = useState(true)
  const [newFrame, setNewFrame]: [Frame, any] = useState(defaultFrame)

  const focusedChannel = actuators.find(a => a.id === props.activeChannelId)

  // When the modal appears, set its content correctly
  const _layerProps: ILayerProps = {
    onLayerDidMount: () => {
      let frames = focusedChannel!.frames;
      if (frames.entries !== undefined)
        setNewFrame(frames.find(f => f.id === props.activeFrameId) || defaultFrame)
      else
        setNewFrame(defaultFrame)
    }
  }

  const _generateFrameFields = () => {
    if (!focusedChannel) return null
    let act = actuatorModels.find(a => a.type === focusedChannel.type)
    if (!act) return null
    return act.variables.map((value, index) => <ActuatorField
        key={value.name + "_" + index}
        label={value.name}
        type={value.type}
        value={newFrame.fields[index]}
        minValue={value.minValue || 0}
        maxValue={value.maxValue || 100}
        onChange={v => _handleVariableChange(index, v)}
      />)
  }

  const _handleVariableChange = (index: number, newValue: any) => {
    let currFrame = newFrame
    currFrame.fields[index] = newValue
    setNewFrame(currFrame)
    verifyConditions()
  }

  const _handleSetFrame = () => {
    // update the state
    dispatch(setFrame(newFrame, newFrame.id, newFrame.channelId))
    // close the modal
    _handleDismiss()
  }

  const _handleDismiss = () => {
    props.onDismiss()
    detailPanel.changeValue("NONE")
  }

  const verifyConditions = () => {
    if (focusedChannel) {
      let act = actuatorModels.find(a => a.type === focusedChannel.type)
      if (act) {
        if (newFrame.fields.length === act.variables.length
          && !newFrame.fields.some(v => v === undefined || v === null)) {
            setIsDisabled(false)
            return
        }
      }
    }
    setIsDisabled(true)
  }

  return (
    <Modal
      titleAriaId={"file-picker-modal"}
      isOpen={props.activeFrameId !== "" && detailPanel.value === "FRAME"}
      layerProps={_layerProps}
      onDismiss={_handleDismiss}
      isBlocking={false}
      containerClassName={contentStyles.container}
    >
      <div className={contentStyles.header}>
        <span id={"file-picker-title"}>Frame Details</span>
        <IconButton
          styles={iconButtonStyles}
          iconProps={{ iconName: 'Cancel' }}
          ariaLabel="Close popup modal"
          onClick={_handleDismiss}
        />
      </div>
      <div className={contentStyles.body}>
        <Stack tokens={stackTokens}>
          {_generateFrameFields()}
          {isDisabled ? (<p>Try update the pin values again if the button is disabled.</p>) : null}
          <PrimaryButton text="Set Actuator" onClick={_handleSetFrame} allowDisabledFocus disabled={isDisabled} />
        </Stack>
      </div>
    </Modal>
  )
}

const stackTokens: IStackTokens = {
  childrenGap: 10,
}