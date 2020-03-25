import React, { useState } from 'react'
import './style.css'
import Rectangle from 'components/Rectangle'

interface LightRectangleStyle {
  backgroundColor: string
  width: string
  height: string
}

function Light(props: any){

  const [color, setColor] = useState("#FF0000")

  const lightStyle: LightRectangleStyle = {
    backgroundColor: color,
    width: "100px",
    height: "100px"
  }

  const chooseColor = (e: any) => {
    // altro
    setColor(e.target.value)
  }
  /**
   * 
   * LightEditor (aggiungi una nuova LUCE)
   *  LightTimeline (per il singolo PIN, asse y)
   *     Light (nel tempo, asse x) <-
   *     Light (nel tempo, asse x) <-
   *     Light (nel tempo, asse x) <-
   *       Rectangle
   *  LightTimeline (per il singolo PIN, asse y)
   *     Light (nel tempo, asse x) <-
   *       Rectangle
   * 
   */


  return (
    <div>
      <input
        type="color"
        value={color}
        id="colorPicker"
        className="colorPicker"
        onChange={(e: any) => chooseColor(e)}
      />
      <label
        htmlFor="colorPicker"
        className="colorPicker_label">Choose a light color</label>
      <Rectangle style={lightStyle}/>
    </div>
  )
}

export default Light