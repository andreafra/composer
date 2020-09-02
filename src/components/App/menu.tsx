import { CommandBar, DefaultButton, Dialog, DialogFooter, DialogType, FontWeights, getTheme, ICommandBarItemProps, IconButton, Layer, mergeStyleSets, Modal, PrimaryButton, TextField } from "@fluentui/react"
import Compiler from "compilers/arduino_v1"
import { iconButtonStyles } from "components/modals/styles"
import DownloadJS from 'downloadjs'
import React, { useContext, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { resetState } from "store/actions"
import { ComposerState } from "types"
import FileManager from "utils/FileManager"
import { useJSONFilteredOutput } from "utils/JSONFilteredOutput"
import { DetailPanelCtx } from "."

export default function Menu() {

  const dispatch = useDispatch()
  const state = useSelector((state: ComposerState) => state)

  const parsedOutput = useJSONFilteredOutput()
  const fileManager = new FileManager()

  const detailPanel = useContext(DetailPanelCtx)

  const [pinToolbar, setPinToolbar] = useState(false)
  const [isNewFileDialogVisible, setIsNewFileDialogVisible] = useState(false)
  const [isArduinoCodeVisible, setIsArduinoCodeVisible] = useState(false)

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
    setIsArduinoCodeVisible(true)
    // console.log(new Compiler(state).build())
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

  const codeRef = useRef<HTMLTextAreaElement>(null)

  const _handleCodeCopy = () => {
    if (codeRef && codeRef.current) {
      codeRef.current.select()
      document.execCommand("copy")
    }
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
      <Modal
        isOpen={isArduinoCodeVisible}
        onDismiss={() => setIsArduinoCodeVisible(false)}
        containerClassName={contentStyles.container}
      >
        <div className={contentStyles.header}>
          <span id="Arduino-Code">Code</span>
          <IconButton
            styles={iconButtonStyles}
            iconProps={{ iconName: "Cancel" }}
            ariaLabel="Close popup modal"
            onClick={() => setIsArduinoCodeVisible(false)}
          />
        </div>
        <div className={contentStyles.body}>
          <TextField
            label="Click on code to copy it!"
            multiline
            rows={10}
            disabled
            defaultValue={new Compiler(state).build()}
            styles={{root: { fontFamily: "monospace"}}}
          />
          <textarea
            readOnly={true}
            style={{height: 0, width: 0, border: "none", padding: 0, opacity: 0}}
            value={new Compiler(state).build()}
            ref={codeRef}
          ></textarea>
          <PrimaryButton
            text="Copy Code"
            iconProps={{iconName: "Copy"}}
            onClick={_handleCodeCopy}
          />
        </div>
      </Modal>
    </>
  )
}

const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    width: 600,
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
  },
  header: [
    theme.fonts.xLargePlus,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px',
    },
  ],
  body: {
    flex: '4 4 auto',
    padding: '0 24px 24px 24px',
    overflowY: 'hidden',
    selectors: {
      p: { margin: '14px 0' },
      'p:first-child': { marginTop: 0 },
      'p:last-child': { marginBottom: 0 },
    },
  },
})
