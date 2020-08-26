import { IconButton, ILayerProps, IStackTokens, Modal, PrimaryButton, Stack, DefaultButton } from "@fluentui/react";
import { DetailPanelCtx } from "components/App";
import ActuatorField from "components/utilities/ActuatorField";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFrame, removeFrame } from "store/actions";
import { ComposerState, Frame } from "types";
import { useActuatorModels } from "utils/actuatorModels";
import { contentStyles, iconButtonStyles } from "./styles";
import NumberField from "components/utilities/NumberField";

export default function FrameDetails(props: {
  frame: Frame
  show: boolean
  onDismiss: () => void
}) {
  
  const detailPanel = React.useContext(DetailPanelCtx)

  const actuatorModels = useActuatorModels()

  const dispatch = useDispatch()
  const options = useSelector((state: ComposerState) => state.system.editorOptions)
  const actuators = useSelector((state: ComposerState) => state.actuators)

  const [isDisabled, setIsDisabled]: [boolean, any] = useState(true)
  const [newFrame, setNewFrame]: [Frame, any] = useState(props.frame)

  const focusedChannel = actuators.find(a => a.id === props.frame.channelId)

  // When the modal appears, set its content correctly
  const _layerProps: ILayerProps = {
    onLayerDidMount: () => {
      setNewFrame(props.frame)
    }
  }

  const _generateFrameFields = () => {
    if (!focusedChannel) return null
    let actModel = actuatorModels.find(a => a.type === focusedChannel.type)
    if (!actModel) return null
    return actModel.variables.map((value, index) => <ActuatorField
        key={value.name + "_" + index}
        label={value.name}
        type={value.type}
        value={props.frame.fields[index]}
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

  const _handleDeleteFrame = () => {
    // update the state
    dispatch(removeFrame(newFrame.id, newFrame.channelId))
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
      isOpen={props.show}
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
          <NumberField
            defaultValue={props.frame.start}
            minValue={0}
            maxValue={Math.floor(options.width/options.frameSize)}
            onChange={v => setNewFrame({...newFrame, start: v})}
            label={"Start"}
          />
          <NumberField
            defaultValue={props.frame.end}
            minValue={0}
            maxValue={Math.floor(options.width/options.frameSize)}
            onChange={v => setNewFrame({...newFrame, end: v})}
            label={"End"}
          />
          <h4>Parameters</h4>
          {_generateFrameFields()}
          {isDisabled ? (<p>Try update the pin values again if the button is disabled.</p>) : null}
          <PrimaryButton text="Set Frame" onClick={_handleSetFrame} allowDisabledFocus disabled={isDisabled} />
          <DefaultButton text="Delete Frame" onClick={_handleDeleteFrame} iconProps={{iconName: 'Delete'}} />
        </Stack>
      </div>
    </Modal>
  )
}

const stackTokens: IStackTokens = {
  childrenGap: 10,
}