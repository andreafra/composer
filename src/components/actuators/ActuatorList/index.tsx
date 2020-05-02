import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './style.css'

import { CommandBar, ICommandBarItemProps} from '@fluentui/react/lib/CommandBar'


import Channel from 'components/actuators/Channel'
import { Channel as ChannelType, ComposerState, PanelTypes } from 'types'
import { setEditPanelVisibility, setEditPanelScope } from 'store/actions'

import shortid from 'shortid'

function ActuatorList(){

  const dispatch = useDispatch()
  const channels = useSelector((state: ComposerState) => state.actuators)

  // /**
  //  * Receive new data from timeline and updates the data structure in editor.
  //  * Called when props.update(...) is called in a child component.
  //  * @param _data the callback data
  //  */
  // const handleTimelineUpdate = (_data: TimelineCallbackData) => {
  //   // Create a new copy to edit (data is read-only)
  //   let newData = data.slice(0)
  //   // TODO: Update the editor
  // }

  /**
   * On click, this function will open a panel where
   * the user can customize 
   */
  const handleNewActuatorBtn = () => {
    dispatch(setEditPanelVisibility(true))
    dispatch(setEditPanelScope(PanelTypes.Actuator, shortid.generate()))
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
