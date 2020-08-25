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

type ChannelProps = {
  id: string
}

function Channel(props: ChannelProps) {

  const detailPanel = useContext(DetailPanelCtx)
  const channels = useSelector((state: ComposerState) => state.actuators.filter(c => c.id === props.id))

  let thisChannel: ChannelType = channels[0]
  if (!thisChannel) {
    throw new Error(`No channel with id: ${props.id}`)
  }
  const options = useSelector((state: ComposerState) => state.system.editorOptions)

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
  const handleNewFrameBtn = () => {
    detailPanel.changeValue("CHANNEL")
  }

  const _items: ICommandBarItemProps[] = [
    {
      key: "newFrame",
      text: "New Frame",
      iconProps: {iconName: "Add"},
      onClick: () => handleNewFrameBtn()
    }
  ]

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
    </div>
  )
}

export default Channel
