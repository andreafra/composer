import React, { useState } from 'react'
import './style.css'
import ResizableRectangle from 'components/ResizableRectangle'

interface LightRectangleStyle {
  backgroundColor: string
  width: number
  height: number
}

function Light(props: any){

  


  return (
    <div className="Light">
      <ResizableRectangle
        
      />
    </div>
  )
}

export default Light