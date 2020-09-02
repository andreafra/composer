import { CommandBar, ICommandBarItemProps, IContextualMenuProps } from "@fluentui/react";
import React, { useContext } from "react";
import usePlayer from "utils/Player2";
import { SoundEditorOptionsCtx } from ".";

export default function SoundEditorMenu() {

  const soundEditorOptions = useContext(SoundEditorOptionsCtx)

  const player = usePlayer()

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
  ]

  return (
    <CommandBar
      items={_items}
      ariaLabel="Use left and right arrow keys to navigate between commands"
    />
  )
}
