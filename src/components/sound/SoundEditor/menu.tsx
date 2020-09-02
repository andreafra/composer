import { CommandBarButton, IContextualMenuProps, Stack, IStackStyles, getTheme, IStyle, ICommandBarItemProps, CommandBar } from "@fluentui/react";
import React, { CSSProperties, useContext } from "react";
import { SoundEditorOptionsCtx } from ".";
import usePlayer from "utils/Player2";

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
      iconProps: { iconName: player.isPlaying ? "Pause" : "Play" },
      onClick: () => player.isPlaying ? player.pause() : player.play()
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
