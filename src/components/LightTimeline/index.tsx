import React, { useState } from 'react'
import './style.css'

import Light from "components/Light"
import { prototype } from 'events'

interface LightData {
  color: string,
  timeStart: number,
  timeEnd: number, 
}

function LightTimeline (props: any) {

  const [color, setColor] = useState("#FF0000")
  const [lightArray, setLightArray]: [LightData[], any] = useState([])

  const [currentTime, setCurrentTime]: [number, any] = useState(0)

  const chooseColor = (e: any) => {
    setColor(e.target.value)
    addElementToLightArray({

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
    
    setLightArray(_)
  }

  const getLights = () => {
    return lightArray.map((light, index) => {
      <Light
        key={index}
        color={light.color}
        timeStart={light.timeStart}
        timeEnd={light.timeEnd}
      />
    })
  }

  /**
   * 
   * LightEditor (aggiungi una nuova LUCE)
   *  LightTimeline (per il singolo PIN, asse y)
   *     Button
   *     Light (nel tempo, asse x) <-
   *     Light (nel tempo, asse x) <-
   *     Light (nel tempo, asse x) <-
   *       Rectangle
   *  LightTimeline (per il singolo PIN, asse y)
   *     Light (nel tempo, asse x) <-
   *       Rectangle
   * 
   */


   /**
    * 1. Gestire quando premi il bottone e aggiungi un rettangolo
    * 2. Renderizzare la struttura dati
    * 3. Modificare la struttura dati
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
        className="colorPicker_label"
      >Choose a light color
      </label>
      {getLights()}
    </div>
  )

  /*
      <Light
        color={color}
      />
   */
}

export default LightTimeline