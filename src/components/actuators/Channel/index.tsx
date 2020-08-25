import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar'
import Rect from 'components/actuators/Rect'
import React, { useState, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import shortid from 'shortid'
import { Channel as ChannelType, ComposerState } from 'types'
import './style.css'
import { ScrollableDiv } from 'components/utilities/ScrollableDiv'
import { LEFT_PADDING } from 'utils/constants'
import { DetailPanelCtx } from 'components/App'
import { Dialog, DialogFooter, PrimaryButton, DefaultButton, DialogType, hasOverflow, TextField, DialogContent, values } from '@fluentui/react'
import { setChannel, removeChannel } from 'store/actions'

type ChannelProps = {
  id: string
}

function Channel(props: ChannelProps) {

  const dispatch = useDispatch()
  const detailPanel = useContext(DetailPanelCtx)
  const channels = useSelector((state: ComposerState) => state.actuators.filter(c => c.id === props.id))

  let thisChannel: ChannelType = channels[0]
  if (!thisChannel) {
    throw new Error(`No channel with id: ${props.id}`)
  }
  const options = useSelector((state: ComposerState) => state.system.editorOptions)

  const [mouseX, setMouseX] = useState(0)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false)
  const [isRenameDialogVisible, setIsRenameDialogVisible] = useState(false)
  const [value, setValue] = useState(thisChannel.name)
  const onMouseMove = (e: any) => {
    if(isMouseDown) {
      setMouseX(e.pageX)
    }
  }

  /**
   * On click, this function will open a panel where
   * the user can customize 
   */
  const handleNewFrameBtn = () => {
    detailPanel.changeValue("CHANNEL")
  }

  const handleDeleteActuator = () => {
    setIsDeleteDialogVisible(false)
    // thisChannel
    dispatch(removeChannel(thisChannel.id))
  }

  const handleRenameActuator = () => {
    setIsRenameDialogVisible(false)
    let newThisChannel = {
      ...thisChannel,
      name: value
    }
    dispatch(setChannel(newThisChannel, thisChannel.id))
  }


  const _items: ICommandBarItemProps[] = [
    {
      key: "newFrame",
      text: "New Frame",
      iconProps: {iconName: "Add"},
      onClick: () => handleNewFrameBtn()
    },
    {
      key: "renameActuator",
      text: "Rename",
      iconProps:{iconName: "Rename"},
      onClick: () => setIsRenameDialogVisible(true)
    },
    {
      key: "deleteActuator",
      text: "Delete",
      iconProps: {iconName: "Delete"},
      onClick: () => setIsDeleteDialogVisible(true)
    },
  ]

  const dialogDeleteContentProps = {
    type: DialogType.normal,
    title: 'Delete',
    closeButtonAriaLabel: 'Close',
    subText: 'Do you want to delete this Actuator?',
  }

  const dialogRenameContentProps = {
    type: DialogType.normal,
    title: 'Rename',
    closeButtonAriaLabel: 'Done',
    subText: 'Choose a new name for the Actuator:',
  }

  const _handleNameChange = (event: any, newValue?: string) => {
    if (newValue === undefined) return;
    setValue(newValue)
  }


  return (
    <div
      className="Channel"
      onMouseMove={e => onMouseMove(e)}
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
    >
      <div className="Channel-toolbox">
        <h3 className="Channel-title">{thisChannel.name}</h3>
        <CommandBar
          items={_items}
          ariaLabel="Use left and right arrow keys to navigate between commands"
        />
      </div>
      <div className="Channel-frames">
        <ScrollableDiv>
          <div className="Channel-scrollable" style={{width: options.width, marginLeft: LEFT_PADDING}}>
            {Array.from(thisChannel.frames).map(([value, frame]) => (
              <Rect
                key={value}
                frame={frame}
                x={mouseX}
                shouldEdit={isMouseDown}
              />)
            )}
          </div>
        </ScrollableDiv>
      </div>
      <Dialog
        hidden={!isDeleteDialogVisible}
        onDismiss={() => setIsDeleteDialogVisible(false)}
        dialogContentProps={dialogDeleteContentProps}
      >
        <DialogFooter>
          <PrimaryButton onClick={() => handleDeleteActuator()} text="Yes" />
          <DefaultButton onClick={() => setIsDeleteDialogVisible(false)} text="No" />
        </DialogFooter>
      </Dialog>
      <Dialog
        hidden={!isRenameDialogVisible}
        onDismiss={() => setIsRenameDialogVisible(false)}
        dialogContentProps={dialogRenameContentProps}
      >
     <DialogContent>
        <TextField  
          placeholder="Enter new name" 
          onChange = {_handleNameChange}
        />
        </DialogContent>
        <DialogFooter>
          {/* <PrimaryButton onClick={() => {}} text="" /> */}
          <DefaultButton onClick={() => handleRenameActuator()} text="Done" />
        </DialogFooter>
      </Dialog>
    </div>
  )
}

export default Channel
