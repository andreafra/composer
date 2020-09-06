import { DefaultButton, Dialog, DialogContent, DialogFooter, DialogType, PrimaryButton, TextField, getTheme } from '@fluentui/react'
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar'
import Rect from 'components/actuators/Rect'
import { DetailPanelCtx } from 'components/App'
import ActuatorDetails from 'components/modals/ActuatorDetails'
import FrameDetails from 'components/modals/FrameDetails'
import { ScrollableDiv } from 'components/utilities/ScrollableDiv'
import React, { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import shortid from 'shortid'
import { removeChannel, setChannel } from 'store/actions'
import { Channel as ChannelType, ComposerState, Frame } from 'types'
import { LEFT_PADDING } from 'utils/constants'
import './style.css'
import { useActuatorModels } from 'utils/actuatorModels'
import Timeline from 'components/utilities/Timeline'

type ChannelProps = {
  id: string
}

function Channel(props: ChannelProps) {

  const dispatch = useDispatch()
  const detailPanel = useContext(DetailPanelCtx)
  const channel = useSelector((state: ComposerState) => state.actuators.find(c => c.id === props.id) as ChannelType)
  const options = useSelector((state: ComposerState) => state.system.editorOptions)
  const actuatorModels = useActuatorModels()
  const theme = getTheme()

  const [activeFrameId, setActiveFrameId] = useState("")
  const [mouseX, setMouseX] = useState(0)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [isActuatorDetailsVisible, setIsActuatorDetailsVisible] = useState(false)
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false)
  const [isRenameDialogVisible, setIsRenameDialogVisible] = useState(false)
  const [channelName, setChannelName] = useState(channel.name)
  const onMouseMove = (e: any) => {
    if (isMouseDown) {
      setMouseX(e.pageX)
    }
  }

  /**
   * On click, this function will open a panel where
   * the user can customize 
   */
  const _handleNewFrameBtn = () => {
    let newId = shortid.generate()
    setActiveFrameId(newId)
    detailPanel.changeValue("FRAME")
  }

  const _handleUpdateChannelBtn = () => {
    setIsActuatorDetailsVisible(true)
    detailPanel.changeValue("CHANNEL")
  }

  const _handleDeleteActuator = () => {
    setIsDeleteDialogVisible(false)
    // channel
    dispatch(removeChannel(channel.id))
  }

  const _handleRenameActuator = () => {
    setIsRenameDialogVisible(false)
    let newThisChannel = {
      ...channel,
      name: channelName
    }
    dispatch(setChannel(newThisChannel, channel.id))
  }


  const _items: ICommandBarItemProps[] = [
    {
      key: "newFrame",
      text: "New Frame",
      iconProps: { iconName: "Add" },
      onClick: _handleNewFrameBtn
    },
    {
      key: "renameActuator",
      text: "Rename",
      iconProps: { iconName: "Rename" },
      onClick: () => setIsRenameDialogVisible(true)
    },
    {
      key: "deleteActuator",
      text: "Delete",
      iconProps: { iconName: "Delete" },
      onClick: () => setIsDeleteDialogVisible(true)
    },
    {
      key: "changeActuatorDetails",
      text: "Details",
      iconProps: { iconName: "Settings" },
      onClick: _handleUpdateChannelBtn
    },
  ]


  const _farItems: ICommandBarItemProps[] = [
    {
      key: 'info',
      text: `Id: ${channel.id}`,
      // This needs an ariaLabel since it's icon-only
      ariaLabel: `Id: ${channel.id}`,
      iconOnly: true,
      iconProps: { iconName: 'Info' },
    },
  ]

  const _handleNameChange = (event: any, newValue?: string) => {
    if (newValue === undefined) return;
    setChannelName(newValue)
  }

  const _generateFields = (frame: Frame) => {
    let actModel = actuatorModels.find(a => a.type === channel.type)
    if (!actModel) return null
    return actModel.variables.map((title, index) => {
      switch (title.type) {
        case "COLOR":
          return <span key={frame.id + title.type + index}><b>{title.name}</b>: <div className="Rect-content--color" style={{ backgroundColor: frame.fields[index] }}></div></span>
        case "BOOL":
        case "NUMBER":
        default:
          return <span key={frame.id + title.type + index}><b>{title.name}</b>: {frame.fields[index]}</span>
      }
    })
  }

  const _generateFrames = () => {
    if (channel && channel.frames.length) {
      let frames = channel.frames
      return frames.map((frame) => (
        <Rect
          key={frame.id}
          frame={frame}
          fields={_generateFields(frame)}
          x={mouseX}
          shouldEdit={isMouseDown}
          onDoubleClick={(id) => {
            detailPanel.changeValue("FRAME")
            setActiveFrameId(id)
          }}
        />)
      )
    }
    return null
  }

  const newFrame: Frame = {
    id: activeFrameId,
    channelId: channel.id,
    fields: [],
    color: theme.palette.accent,
    start: 0,
    end: 0
  }

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

  if (channel) {
    return (
      <div
        className="Channel"
        onMouseMove={e => onMouseMove(e)}
        onMouseDown={() => setIsMouseDown(true)}
        onMouseUp={() => setIsMouseDown(false)}
        onMouseLeave={() => setIsMouseDown(false)}
      >
        <div className="Channel-toolbox">
          <h3 className="Channel-title">{channel.name}</h3>
          <CommandBar
            items={_items}
            farItems={_farItems}
            ariaLabel="Use left and right arrow keys to navigate between commands"
          />
        </div>
        <div className="Channel-frames">
          <ScrollableDiv>
            <Timeline />
            <div className="Channel-scrollable" style={{ width: options.width, marginLeft: LEFT_PADDING }}>
              {_generateFrames()}
            </div>
          </ScrollableDiv>
        </div>
        <Dialog
          hidden={!isDeleteDialogVisible}
          onDismiss={() => setIsDeleteDialogVisible(false)}
          dialogContentProps={dialogDeleteContentProps}
        >
          <DialogFooter>
            <PrimaryButton onClick={_handleDeleteActuator} text="Yes" />
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
              onChange={_handleNameChange}
            />
          </DialogContent>
          <DialogFooter>
            {/* <PrimaryButton onClick={() => {}} text="" /> */}
            <DefaultButton onClick={_handleRenameActuator} text="Done" />
          </DialogFooter>
        </Dialog>
        <FrameDetails
          frame={channel.frames.find(fr => fr.id === activeFrameId) || newFrame}
          show={detailPanel.value === "FRAME" && activeFrameId !== ""}
          onDismiss={() => setActiveFrameId("")}
        />
        <ActuatorDetails activeChannelId={channel.id} show={isActuatorDetailsVisible} onDismiss={() => setIsActuatorDetailsVisible(false)} />
      </div>
    )
  } else {
    console.error("No Channel found with id: " + props.id)
    return null
  }
}

export default Channel
