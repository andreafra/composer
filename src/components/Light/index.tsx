import React, { useState } from 'react'
import './style.css'
import Rectangle from 'components/Rectangle'

interface LightRectangleStyle {
backgroundColor: string
width: string
height: string
}

function Light(props: any){


  const lightStyle: LightRectangleStyle = {
    backgroundColor: props.color,
    width: "100px",
    height: "100px"
   }


  return (
    <Rectangle style={lightStyle}/>
  )
}

export default Light