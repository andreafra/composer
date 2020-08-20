import * as React from 'react';
import { Modal, getTheme, mergeStyleSets, Selection, FontWeights, DetailsList, DetailsListLayoutMode, Pivot, PivotItem, Label, IconButton, SelectionMode, FontIcon, DefaultButton } from '@fluentui/react';
import { useSelector, useDispatch } from 'react-redux';
import { ComposerState } from 'types';
import { setFilePickerVisibility, setState } from 'store/actions';
import { useState } from 'react';
import FileManager, {File, FileList} from 'utils/FileManager'

export const FilePicker = () => {
  
  const fileManager = new FileManager()

  const dispatch = useDispatch()
  const state = useSelector((state: ComposerState) => state)
  const isFilePickerVisible = useSelector((state: ComposerState) => state.system.filePickerVisibility)
  const [selectedItem, setSelectedItem]: [any, any] = useState(null)

  const _onItemInvoked = (item: File): void => {
    fileManager.setFile(state)
    // Load another file into the state
    let loadedState = fileManager.getFile(item.id)
    if (loadedState) {
      dispatch(setState(loadedState))
    }
    // TODO: Handle possible errors gracefully
  }


  const items = fileManager.getSavedFilesList()

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
    },
    fileIconImg: {
      verticalAlign: 'middle',
      maxHeight: '24px',
      maxWidth: '24px',
    }
  })

  const _columns = [
    {
      key: 'column0',
      name: '',
      className: classNames.fileIconCell,
      iconClassName: classNames.fileIconHeaderIcon,
      ariaLabel: 'Column operations for File type, Press to sort on File type',
      iconName: 'Page',
      isIconOnly: true,
      fieldName: 'name',
      minWidth: 16,
      maxWidth: 16,
      onRender: () => {
        return <FontIcon iconName="FileCode" className={classNames.fileIconImg} />;
      }
    },
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
    fileManager.deleteFile(selectedItem)
  }

  const contextualButtons = () => {
    if (selectedItem !== null)
    return (
      <DefaultButton
        text={"Delete"}
        iconProps={{ iconName: "Delete"}}
        onClick={_handleFileDelete}
        disabled={selectedItem === null}
      />
    )
    else return
  }

  return (
      <Modal
        titleAriaId={"file-picker-modal"}
        isOpen={isFilePickerVisible}
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
              <Label>Tip: Double click to open a file! {contextualButtons()}</Label>
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
              <Label>Upload a file from your computer:</Label>
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
