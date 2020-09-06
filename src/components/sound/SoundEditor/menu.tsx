import { CommandBar, ICommandBarItemProps, IContextualMenuProps, Dialog, DialogContent, TextField, DialogFooter, DefaultButton, DialogType } from "@fluentui/react";
import React, { useContext, useState } from "react";
import usePlayer from "utils/Player2";
import { SoundEditorOptionsCtx } from ".";
import NumberField from "components/utilities/NumberField";
import { versions } from "process";
import { useDispatch, useSelector } from "react-redux";
import { ComposerState, EditorOptions } from "types";
import { setEditorOptions } from "store/actions";

export default function SoundEditorMenu() {

  const soundEditorOptions = useContext(SoundEditorOptionsCtx)

  const player = usePlayer()

  const dispatch = useDispatch()
  const editorOptions = useSelector((state: ComposerState) => state.system.editorOptions)


  const [isDetailsVisible, setIsDetailsVisible] = useState(false)

  const instrumentProps: IContextualMenuProps = {
    items: [
      {
        key: 'square',
        text: 'Square Wave',
        onClick: () => soundEditorOptions.changeInstrumentType("square")
      },
      {
        key: 'sine',
        text: 'Sine Wave',
        onClick: () => soundEditorOptions.changeInstrumentType("sine")
      },
      {
        key: 'triangle',
        text: 'Triangle Wave',
        onClick: () => soundEditorOptions.changeInstrumentType("triangle")
      },
      {
        key: 'sawtooth',
        text: 'Sawtooth Wave',
        onClick: () => soundEditorOptions.changeInstrumentType("sawtooth")
      },
    ],
  };

  const _items: ICommandBarItemProps[] = [
    {
      key: "play",
      text: "Play",
      iconProps: { iconName: "Play" },
      onClick: () => player.play()
    },
    {
      key: "stop",
      text: "Stop",
      iconProps: { iconName: "Stop" },
      onClick: () => player.stop()
    },
    {
      key: "instrument",
      text: "Instruments",
      iconProps: { iconName: "MusicInCollection" },
      subMenuProps: instrumentProps
    },
    {
      key: "draw-notes",
      text: "Draw notes",
      iconProps: { iconName: "Edit" },
      onClick: () => soundEditorOptions.changeMouseMode("draw")
    },
    {
      key: "erase-notes",
      text: "Erase notes",
      iconProps: { iconName: "EraseTool" },
      onClick: () => soundEditorOptions.changeMouseMode("erase")
    },
    {
      key: "details",
      text: "Details",
      iconProps: { iconName: "Settings" },
      onClick: () => setIsDetailsVisible(true)
    },
  ]

  const _handleSpeakerPinChange = (pin: number) => {
    dispatch(setEditorOptions({
      ...editorOptions,
      speakerPin: pin
    }))
  }

  return (
    <>
    <CommandBar
      items={_items}
      ariaLabel="Use left and right arrow keys to navigate between commands"
    />
    <Dialog
      hidden={!isDetailsVisible}
      onDismiss={() => setIsDetailsVisible(false)}
      dialogContentProps={dialogRenameContentProps}
    >
      <DialogContent>
        <NumberField
          label={"Speaker pin"}
          defaultValue={editorOptions.speakerPin || 9}
          onChange={(pin: number) => _handleSpeakerPinChange(pin)}
          minValue={0}
          maxValue={255}
        />
      </DialogContent>
      <DialogFooter>
        <DefaultButton onClick={() => setIsDetailsVisible(false)} text="Done" />
      </DialogFooter>
    </Dialog>
    </>
  )
}

const dialogRenameContentProps = {
  type: DialogType.normal,
  title: 'Sound details',
  closeButtonAriaLabel: 'Done',
  subText: 'Set the pin of the speaker you\'ll use to play sounds.',
}