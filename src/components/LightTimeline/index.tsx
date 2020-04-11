import React, { useState } from 'react'
import './style.css'

import Rect from "components/ResizableRectangle"
import Button from "components/Button"
import { prototype } from 'events'

interface LightData {
  color: string,
  frameStart: number,
  frameEnd: number, 
}

interface LightRectStyle {
  backgroundColor: string
  width: number
  height: number
}

function LightTimeline (props: any) {

  const [color, setColor] = useState("#FF0000")
  const [lightArray, setLightArray]: [LightData[], any] = useState([])
  const [currentFrame, setCurrentFrame]: [number, any] = useState(0)
  
  //Size of a single "frame"
  const res = props.editorResolution

  const chooseColor = (e: any) => {
    setColor(e.target.value)
  }

  const addLight = () => {
    addElementToLightArray({
      color: color,
      frameStart: currentFrame,
      frameEnd: currentFrame + props.editorFrameSize
    })
  }
  
  /**
   * Add a object to lightArray.
   * @param element A object representing the data of a light in a certain span
   * of time.
   */
  const addElementToLightArray = (element: LightData) => {
    let _ = lightArray.slice(0)
    _.push(element)
    // Add the new light block after the last light block ends
    setCurrentFrame(currentFrame + 1)

    setLightArray(_)
  }

  const getLights = () => {
    return lightArray.map((light, index) =>
      <Rect
        key={index}
        style={{
          backgroundColor: light.color,
          width: props.editorFrameSize,
          height: 100
        }}
        frameStart={light.frameStart}
        frameEnd={light.frameEnd}
        editorLeftPadding={props.editorLeftPadding}
      />
  )}

  return (
    <div className="LightTimeline">
      <div className="LightTimeline-tools">
        <Button 
          name="Add a Light"
          action={addLight}
        />
        <input
          type="color"
          value={color}
          id="colorPicker"
          className="colorPicker"
          onChange={(e: any) => chooseColor(e)}
        />
        <label
          htmlFor="colorPicker"
          className="colorPicker_label"
        >Choose a light color
        </label>
      </div>
      <div className="LightTimeline-lights">
      {/* GET LIGHTS */}
      </div>
    </div>
  )
}

export default LightTimeline