import { useDispatch, useSelector } from "react-redux"
import { ComposerState, Field, Frame } from "types"
import { useActuatorModels } from "utils/actuatorModels"
import React, { useState } from "react"
import shortid from "shortid"
import { setFrame, removeFrame } from "store/actions"
import { Stack, SpinButton, PrimaryButton, DefaultButton, IStackTokens } from "@fluentui/react"
import FieldElement from './field'

const StackTokens: Partial<IStackTokens> = { childrenGap: 10 };

function FrameConfig() {
  // const dispatch = useDispatch()
  // const options = useSelector((state: ComposerState) => state.system.editorOptions)
  // const edit = useSelector((state: ComposerState) => state.system.editPanel)
  // const channels = useSelector((state: ComposerState) => state.actuators.filter(c => c.id === edit.channelId))
  // const actuatorBlueprints = useCustomActuators()

  // const channel = channels[0]
  // const actuatorBlueprint = actuatorBlueprints.filter(a => a.type === channel.type)[0]
  // const fields: Field[] = actuatorBlueprint.fields || []

  // const [newFrame, setNewFrame]: [Frame, any] = useState(channel.frames.get(edit.frameId!) || {
  //   id: edit.frameId || shortid.generate(),
  //   channelId: channel.id,
  //   start: 0,
  //   end: 0,
  //   color: "#ff0000",
  //   fields: []
  // })

  // const _handleFieldUpdate = (value: string, index: number) => {
  //   // deep clone
  //   let _newFrame = JSON.parse(JSON.stringify(newFrame)) as Frame

  //   _newFrame.fields[index] = value
  //   setNewFrame(_newFrame)
  //   if (fields[index].type === "COLOR")
  //     setNewFrame({...newFrame, color: value})
  // }

  // const _handleFrameIncrement = (value: string, pos: "start" | "end") => {
  //   let _val = parseInt(value)
  //   _val = _val < options.width ? _val + 1 : _val

  //   if (pos === "start")
  //     setNewFrame({...newFrame, start: _val})
  //     if (_val >= newFrame.end && newFrame.end <= options.width)
  //       setNewFrame({...newFrame, start: _val, end: _val})
  //   if (pos === "end" && _val <= options.width)
  //     setNewFrame({...newFrame, end: _val})
  // }
  
  // const _handleFrameDecrement = (value: string, pos: "start" | "end") => {
  //   let _val = parseInt(value)
  //   _val = _val > 0 ? _val - 1 : _val
  //   if (pos === "start" && _val >= 0)
  //     setNewFrame({...newFrame, start: _val})
  //   if (pos === "end")
  //     setNewFrame({...newFrame, end: _val})
  //     if (_val <= newFrame.start && newFrame.start > 0)
  //       setNewFrame({...newFrame, start: _val, end: _val})
  // }

  // const _setFrame = () => {
  //   console.log(newFrame)
  //   dispatch(setFrame(newFrame, newFrame.id, channel.id))
  //   dispatch(setEditPanelVisibility(false))
  // }

  // const _deleteRect = () => {
  //   if (edit.frameId && edit.channelId) {
  //     dispatch(removeFrame(newFrame.id,channel.id))
  //     dispatch(setEditPanelVisibility(false))
  //   }
  // }

  // return <div>
  //   <Stack tokens={StackTokens}>
  //     <h3>Frame of {channel.name}</h3>
  //     <SpinButton
  //       value={String(newFrame.start)}
  //       label={'Start Frame:'}
  //       min={0}
  //       max={options.width}
  //       step={1}
  //       iconProps={{ iconName: 'TrimStart' }}
  //       onIncrement={value => _handleFrameIncrement(value, "start")}
  //       onDecrement={value => _handleFrameDecrement(value, "start")}
  //       incrementButtonAriaLabel={'Increase value by 1'}
  //       decrementButtonAriaLabel={'Decrease value by 1'}
  //     />
  //     <SpinButton
  //       value={String(newFrame.end)}
  //       label={'End Frame:'}
  //       min={0}
  //       max={options.width}
  //       step={1}
  //       iconProps={{ iconName: 'TrimEnd' }}
  //       onIncrement={value => _handleFrameIncrement(value, "end")}
  //       onDecrement={value => _handleFrameDecrement(value, "end")}
  //       incrementButtonAriaLabel={'Increase value by 1'}
  //       decrementButtonAriaLabel={'Decrease value by 1'}
  //     />
  //     {fields.map((value, index) =>
  //       <FieldElement
  //         key={index}
  //         value={newFrame.fields[index] || ""}
  //         spec={value}
  //         update={value => _handleFieldUpdate(value, index)}
  //       />
  //     )}
  //     <PrimaryButton text="Set Frame" onClick={_setFrame} allowDisabledFocus disabled={false} />
  //     {
  //       edit.frameId && channel.frames.has(edit.frameId) ?
  //       <DefaultButton
  //         text="Delete Frame"
  //         onClick={_deleteRect}
  //         allowDisabledFocus
  //         disabled={edit.frameId === undefined || edit.channelId === undefined}
  //       /> : null
  //     }
      
  //   </Stack>
  // </div>
  return <></>
}

export default FrameConfig