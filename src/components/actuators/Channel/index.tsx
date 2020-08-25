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
import FrameDetails from 'components/modals/FrameDetails'

type ChannelProps = {
  id: string
}

function Channel(props: ChannelProps) {

  const detailPanel = useContext(DetailPanelCtx)
  const channel = useSelector((state: ComposerState) => state.actuators.find(c => c.id === props.id) as ChannelType)
  const options = useSelector((state: ComposerState) => state.system.editorOptions)

  const [activeFrameId, setActiveFrameId] = useState("")

  const [mouseX, setMouseX] = useState(0)
  const [isMouseDown, setIsMouseDown] = useState(false)

  const onMouseMove = (e: any) => {
    if(isMouseDown) {
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

  const _items: ICommandBarItemProps[] = [
    {
      key: "newFrame",
      text: "New Frame",
      iconProps: {iconName: "Add"},
      onClick: _handleNewFrameBtn
    }
  ]

  const _generateFrames = () => {
    if (channel && channel.frames.length) {
      let frames = channel.frames
      return frames.map((frame) => (
        <Rect
          key={frame.id}
          frame={frame}
          x={mouseX}
          shouldEdit={isMouseDown}
        />)
      )
    }
    return null
  }

  if (channel) {return (
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
          ariaLabel="Use left and right arrow keys to navigate between commands"
        />
      </div>
      <div className="Channel-frames">
        <ScrollableDiv>
          <div className="Channel-scrollable" style={{width: options.width, marginLeft: LEFT_PADDING}}>
            {_generateFrames()}
          </div>
        </ScrollableDiv>
      </div>
      <FrameDetails
        activeChannelId={channel.id}
        activeFrameId={activeFrameId}
        onDismiss={() => setActiveFrameId("")}
      />
    </div>
  )} else {
    console.error("No Channel found with id: " + props.id)
    return null
  }
}

export default Channel
