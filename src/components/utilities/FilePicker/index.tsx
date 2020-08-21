import * as React from 'react';
import { Modal, getTheme, mergeStyleSets, Selection, FontWeights, DetailsList, DetailsListLayoutMode, Pivot, PivotItem, Label, IconButton, SelectionMode, FontIcon, DefaultButton, Stack, IStackItemStyles, DefaultPalette, IStackStyles, CompoundButton } from '@fluentui/react';
import { useSelector, useDispatch } from 'react-redux';
import { ComposerState } from 'types';
import { setFilePickerVisibility, setState } from 'store/actions';
import { useState, useRef } from 'react';
import FileManager, {File, FileList} from 'utils/FileManager'

export const FilePicker = () => {
  
  const fileManager = new FileManager()

  const dispatch = useDispatch()
  const state = useSelector((state: ComposerState) => state)
  const isFilePickerVisible = useSelector((state: ComposerState) => state.system.filePickerVisibility)
  const [selectedItem, setSelectedItem]: [File | null, any] = useState(null)

  const _onItemInvoked = (item: File): void => {
    fileManager.setFile(state)
    // Load another file into the state
    let loadedState = fileManager.getFile(item.id)
    if (loadedState) {
      dispatch(setState(loadedState))
    }
    // TODO: Handle possible errors gracefully
  }

  // TODO: Might want to refactor filemanager into an hook
  const [items, setItems] = useState(fileManager.getSavedFilesList())

  const inputFileRef = useRef<HTMLInputElement>(null);

  const _columns = [
    { key: 'column1', name: 'Name', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'column2', name: 'Last Modified', fieldName: 'lastModified', minWidth: 100, maxWidth: 300, isResizable: true }
  ]

  const _selection: Selection = new Selection({
    onSelectionChanged: () => _handleSelection()
  })

  const _handleSelection = () => {
    let selection = _selection.getSelection()
    if (selection) {
      let _selectedItem = selection[0]
      if (_selectedItem) {
        setSelectedItem(_selectedItem)
        return
      }
    }
    setSelectedItem(null)
  }

  const _handleFileDelete = () => {
    // TODO: Not so easy, we gotta first create a blank file or something,
    // or you can't delete your active file
    if (selectedItem) {
      let newItems = fileManager.deleteFile((selectedItem as File).id)
      setItems(newItems)
    }
  }

  const _handleFileUploadBtn = () => {
    if (inputFileRef.current)
        inputFileRef.current.click()
  }

  const _handleUploadedFile = (e:any) => {
    if (e.target) {
      let file = e.target.files[0]
      let reader = new FileReader()
      // setup read event
      reader.onload = (ev) => {
        let rawContent = ev.target?.result
        let parsedContent = JSON.parse(rawContent as string)
        if (parsedContent) {
          dispatch(setState(parsedContent))
        } else {
          console.error("Error parsing uploaded file!")
        }
      }
      // start reading the file
      reader.readAsText(file)
    }
  }

  return (
      <Modal
        titleAriaId={"file-picker-modal"}
        isOpen={isFilePickerVisible}
        onLayerDidMount={() => setItems(fileManager.getSavedFilesList())}
        onDismiss={() => dispatch(setFilePickerVisibility(false))}
        isBlocking={true}
        containerClassName={contentStyles.container}
      >
        <div className={contentStyles.header}>
          <span id={"file-picker-title"}>File Picker</span>
          <IconButton
            styles={iconButtonStyles}
            iconProps={{ iconName: 'Cancel' }}
            ariaLabel="Close popup modal"
            onClick={() => dispatch(setFilePickerVisibility(false))}
          />
        </div>
        <div className={contentStyles.body}>
          <Pivot aria-label="File Picker">
            <PivotItem
              headerText="Local Files"
              headerButtonProps={{
                'data-order': 1,
                'data-title': 'Local Files',
              }}
            >
              <DefaultButton
                text={"Delete"}
                iconProps={{ iconName: "Delete"}}
                onClick={_handleFileDelete}
                disabled={selectedItem === null || selectedItem!.id === state.system.filename}
              />
              <DetailsList
                items={items}
                columns={_columns}
                setKey="set"
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.single}
                selectionPreservedOnEmptyClick={false}
                selection={_selection}
                onItemInvoked={_onItemInvoked}
              />
            </PivotItem>
            <PivotItem headerText="Upload">
              <CompoundButton
                primary
                secondaryText="Choose a save file from your computer"
                onClick={_handleFileUploadBtn}>
                Upload file
              </CompoundButton>
              <input type="file" id="input" ref={inputFileRef} style={{display: "none"}} onChange={(e) => _handleUploadedFile(e)}/>
            </PivotItem>
            <PivotItem headerText="OneDrive">
              <Label>Soon</Label>
            </PivotItem>
          </Pivot>
        </div>
      </Modal>
  )
}

const theme = getTheme();

const contentStyles = mergeStyleSets({
  container: {
    minWidth: 640,
    minHeight: 520,
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
  },
  header: [
    theme.fonts.xLargePlus,
    {
      flex: '1 1 auto',
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

const itemAlignmentsStackStyles: IStackStyles = {
  root: {
    background: DefaultPalette.themeTertiary,
    height: 100,
  },
}

const iconButtonStyles = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px',
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
}

const classNames = mergeStyleSets({
  fileIconHeaderIcon: {
    padding: 0,
    fontSize: '16px',
  },
  fileIconCell: {
    textAlign: 'center',
    selectors: {
      '&:before': {
        content: '.',
        display: 'inline-block',
        verticalAlign: 'middle',
        height: '100%',
        width: '0px',
        visibility: 'hidden',
      },
    },
  }
})