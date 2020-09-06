import { CompoundButton, DefaultButton, DetailsList, DetailsListLayoutMode, IconButton, Label, Modal, Pivot, PivotItem, Selection, SelectionMode, ILayerProps } from '@fluentui/react';
import { DetailPanelCtx } from 'components/App';
import * as React from 'react';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ComposerState } from 'types';
import FileManager, { File } from 'utils/FileManager';
import { contentStyles, iconButtonStyles } from './styles';
import { setState } from 'store/actions';

/**
 * FilePicker is the dialog window in the top bar that appears
 * when clicking "Load". The user can Load a saved file from the current session, 
 * or load a file from their computer or from OneDrive
 */

export default function FilePicker() {
  
  const fileManager = new FileManager()

  const dispatch = useDispatch()

  const detailPanel = React.useContext(DetailPanelCtx)
  const state = useSelector((state: ComposerState) => state)
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
  
  const _layerProps: ILayerProps = {
    onLayerDidMount: () => setItems(fileManager.getSavedFilesList())
  }


  return (
      <Modal
        titleAriaId={"file-picker-modal"}
        isOpen={detailPanel.value === "FILE_PICKER"}
        layerProps={_layerProps}
        onDismiss={() => detailPanel.changeValue("NONE")}
        isBlocking={false}
        containerClassName={contentStyles.container}
      >
        <div className={contentStyles.header}>
          <span id={"file-picker-title"}>File Picker</span>
          <IconButton
            styles={iconButtonStyles}
            iconProps={{ iconName: 'Cancel' }}
            ariaLabel="Close popup modal"
            onClick={() => detailPanel.changeValue("NONE")}
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
