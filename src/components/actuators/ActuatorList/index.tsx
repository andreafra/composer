import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar'
import Channel from 'components/actuators/Channel'
import React, { useContext, createContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import shortid from 'shortid'
import { Channel as ChannelType, ComposerState } from 'types'
import './style.css'
import FoldableDiv from 'components/utilities/FoldableDiv'
import { DetailPanelCtx } from 'components/App'
import ActuatorDetails from 'components/modals/ActuatorDetails'

export const ActiveChannelCtx = createContext({
  channelId: null,
  frameId: null,
  setChannelId: (id: string|null) => {},
  setFrameId: (id: string|null) => {}
})

function ActuatorList(){

  const activeChannel = useContext(ActiveChannelCtx)
  const [currentChannelId, setCurrentChannelId]: [string|null, any] = useState(activeChannel.channelId)
  const [currentFrameId, setCurrentFrameId]: [string|null, any] = useState(activeChannel.frameId)
  activeChannel.setChannelId = (id) => setCurrentChannelId(id)
  activeChannel.setFrameId = (id) => setCurrentFrameId(id)
  
  const detailPanel = useContext(DetailPanelCtx)
  const channels = useSelector((state: ComposerState) => state.actuators)

  /**
   * On click, this function will open a panel where
   * the user can customize 
   */
  const handleNewActuatorBtn = () => {
    detailPanel.changeValue("CHANNEL")
    activeChannel.setChannelId(null)
  }

  // CammandBar items
  const _items: ICommandBarItemProps[] = [
    {
      key: "newActuator",
      text: "New Actuator",
      iconProps: {iconName: "Add"},
      onClick: handleNewActuatorBtn
    }
  ]

  return (
    <div
      className="Editor"
    >
      <FoldableDiv title="Actuators">
        <>
          <CommandBar
            items={_items}
            ariaLabel="Use left and right arrow keys to navigate between commands"
          />
          <div className="Editor-channels">
            {
              channels.map((channel: ChannelType) => 
                <Channel
                  key={channel.id}
                  id={channel.id}
                />
              )
            }
          </div>
        </>
      </FoldableDiv>
    <ActuatorDetails />
    </div>
  )
}



export default ActuatorList
