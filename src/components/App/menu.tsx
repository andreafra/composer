import { CommandBar, ICommandBarItemProps, Layer, Dialog, DialogFooter, PrimaryButton, DefaultButton, DialogType } from "@fluentui/react"
import Compiler from "compilers/arduino_v1"
import DownloadJS from 'downloadjs'
import React, { useContext, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { ComposerState } from "types"
import FileManager from "utils/FileManager"
import { useJSONFilteredOutput } from "utils/JSONFilteredOutput"
import { DetailPanelCtx } from "."
import { resetState } from "store/actions"

export default function Menu() {

  const dispatch = useDispatch()
  const state = useSelector((state: ComposerState) => state)

  const parsedOutput = useJSONFilteredOutput()
  const fileManager = new FileManager()

  const detailPanel = useContext(DetailPanelCtx)

  const [pinToolbar, setPinToolbar] = useState(false)
  const [isNewFileDialogVisible, setIsNewFileDialogVisible] = useState(false)

  const handleDownload = () => {
    DownloadJS(parsedOutput(), state.system.filename + ".json", "application/json")
  }

  const handleSaveWithDownload = () => {
    DownloadJS(JSON.stringify(state), state.system.filename + ".json", "application/json")
  }

  const handleSave = () => {
    console.log("Saving file...")
    fileManager.setFile(state)
  }

  const handleOpen = () => {
    detailPanel.changeValue("FILE_PICKER")
  }

  const handleOptions = () => {
    detailPanel.changeValue("FILE_DETAILS")
  }

  const handleBuildArduino = () => {
    console.log(new Compiler(state).build())
  }

  const handleNewFile = () => {
    setIsNewFileDialogVisible(false)
    dispatch(resetState())
  }

  const _items: ICommandBarItemProps[] = [
    {
      key: 'new-file',
      text: 'New',
      iconProps: { iconName: 'QuickNote' },
      onClick: () => setIsNewFileDialogVisible(true)
    },
    {
      key: 'save',
      text: 'Save',
      iconProps: { iconName: 'Save' },
      subMenuProps: {
        items: [
          {
            key: 'save',
            text: 'Save',
            iconProps: { iconName: 'Save' },
            onClick: handleSave
          },
          {
            key: 'saveToPC',
            text: 'Save to Computer',
            iconProps: { iconName: 'Download' },
            onClick: handleSaveWithDownload
          }
        ]
      }
    },
    {
      key: 'open',
      text: 'Load',
      iconProps: { iconName: 'OpenFolderHorizontal' },
      onClick: handleOpen
    },
    {
      key: 'download',
      text: 'Download',
      iconProps: { iconName: 'Download' },
      subMenuProps: {
        items: [
          {
            key: 'download-json',
            text: 'Download as JSON',
            iconProps: { iconName: 'Save' },
            onClick: handleDownload
          },
          {
            key: 'download-arduino-sketch',
            text: 'Download as Arduino Sketch',
            iconProps: { iconName: 'Build' },
            onClick: handleBuildArduino
          }
        ]
      }
    },
    {
      key: 'options',
      text: 'Options',
      iconProps: { iconName: 'Settings' },
      onClick: handleOptions
    },
  ];

  const _farItems: ICommandBarItemProps[] = [
    {
      key: 'pin',
      text: pinToolbar ? 'Unpin' : 'Pin',
      iconProps: { iconName: pinToolbar ? 'Unpin' : 'Pin' },
      onClick: () => setPinToolbar(!pinToolbar)
    }
  ]

  const toolbar = <CommandBar
    items={_items}
    farItems={_farItems}
    ariaLabel="Use left and right arrow keys to navigate between commands"
  />

  const dialogNewFileContentProps = {
    type: DialogType.normal,
    title: 'New File',
    closeButtonAriaLabel: 'Close',
    subText: 'Do you want to create a new file?',
  }

  return (
    <>
      {pinToolbar ? <Layer>{toolbar}</Layer> : toolbar}
      <Dialog
        hidden={!isNewFileDialogVisible}
        onDismiss={() => setIsNewFileDialogVisible(false)}
        dialogContentProps={dialogNewFileContentProps}
      >
        <DialogFooter>
          <PrimaryButton onClick={handleNewFile} text="Yes" />
          <DefaultButton onClick={() => setIsNewFileDialogVisible(false)} text="No" />
        </DialogFooter>
      </Dialog>
    </>
  )
}