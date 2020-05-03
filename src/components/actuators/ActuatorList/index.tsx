import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar'
import Channel from 'components/actuators/Channel'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import shortid from 'shortid'
import { setEditPanelScope, setEditPanelVisibility } from 'store/actions'
import { Channel as ChannelType, ComposerState } from 'types'
import './style.css'

function ActuatorList(){

  const dispatch = useDispatch()
  const channels = useSelector((state: ComposerState) => state.actuators)

  /**
   * On click, this function will open a panel where
   * the user can customize 
   */
  const handleNewActuatorBtn = () => {
    dispatch(setEditPanelVisibility(true))
    dispatch(setEditPanelScope("ACTUATOR", shortid.generate()))
  }

  // CammandBar items
  const _items: ICommandBarItemProps[] = [
    {
      key: "newActuator",
      text: "New Actuator",
      iconProps: {iconName: "Add"},
      onClick: () => handleNewActuatorBtn()
    }
  ]

  return (
    <div
      className="Editor"
    >
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
    </div>
  )
}



export default ActuatorList
