import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar'
import Channel from 'components/actuators/Channel'
import { DetailPanelCtx } from 'components/App'
import ActuatorDetails from 'components/modals/ActuatorDetails'
import FoldableDiv from 'components/utilities/FoldableDiv'
import React, { useContext, useState } from 'react'
import { useSelector } from 'react-redux'
import shortid from 'shortid'
import { Channel as ChannelType, ComposerState } from 'types'
import './style.css'

function ActuatorList(){

  const detailPanel = useContext(DetailPanelCtx)
  
  const channels = useSelector((state: ComposerState) => state.actuators)

  const [activeChannelId, setActiveChannelId] = useState("")
  

  /**
   * On click, this function will open a panel where
   * the user can customize 
   */
  const _handleNewActuatorBtn = () => {
    let newId = shortid.generate()
    setActiveChannelId(newId)
    detailPanel.changeValue("CHANNEL")
  }

  // CammandBar items
  const _items: ICommandBarItemProps[] = [
    {
      key: "newActuator",
      text: "New Actuator",
      iconProps: {iconName: "Add"},
      onClick: _handleNewActuatorBtn
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
      <ActuatorDetails activeChannelId={activeChannelId} show={activeChannelId !== ""} onDismiss={() => setActiveChannelId("")} />
    </div>
  )
}



export default ActuatorList
