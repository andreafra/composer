import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import './style.css'

import { CommandBar, ICommandBarItemProps} from '@fluentui/react/lib/CommandBar'
import Rect from 'components/actuators/Rect'

import { ComposerState, Channel as ChannelType, Frame } from 'types'

type ChannelProps = {
  id: string
}

function Channel(props: ChannelProps) {

  const channels = useSelector((state: ComposerState) => state.actuators.filter(c => c.id === props.id))

  let thisChannel: ChannelType
  if (channels) {
    thisChannel = channels[0]
  } else {
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
  
  const handleRectUpdate = (id: string) => {
    // Should the Rect have a UID

    // HANDLE THE OVERLAPPING RECTS
    // props.frames[data.id] is the Rect that has been edited
    // data.frame is the new frame
    // One possible implementation might be to delete the index-esim
    // frame/rect, and replace it with the new one (data.frame)
    // TODO: when a rect is done resizing, do the following steps:
    // 1. Gracefully handle overlapping Rects
    // 2. Sort the timeline data structure
    // 3. Push the timeline data to the Editor
  }


    // <Rect
    //   key={index}
    //   index={index}
    //   x={mouseX}
    //   shouldEdit={isMouseDown}
    // />

  return (
    <div
      className="Timeline"
      onMouseMove={e => onMouseMove(e)}
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
    >
      <div className="Timeline-toolbox">
        <h3 className="Timeline-title">{thisChannel.name}</h3>
        <CommandBar
          items={_items}
          ariaLabel="Use left and right arrow keys to navigate between commands"
        />
      </div>
      <div
        className="Timeline-frames"
        style={{
          marginLeft: options.leftPadding,
          width: options.width
        }}
      >
        {Object.keys(thisChannel.frames).map((value) => {
          const frame: Frame = thisChannel.frames[value]
          return (
            <Rect
              key={frame.id}
              frame={frame}
              x={mouseX}
              shouldEdit={isMouseDown}
            />
          )
        })}
      </div>
    </div>
  )
}

const _items: ICommandBarItemProps[] = [
  {
    key: "newFrame",
    text: "New Frame",
    iconProps: {iconName: "Add"},
    onClick: () => console.log("Add new Frame...")
  }
]

export default Channel
