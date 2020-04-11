import React, {useState, useEffect} from 'react'
import './style.css'

interface RectStyle {
  backgroundColor: string
  width: string
  height: string
  marginLeft: string
}

function ResizableRectangle(props: any){

  const [rectStyle, setRectStyle]: [RectStyle, any] = useState({
    backgroundColor: props.style.backgroundColor,
    width: props.style.width + "px",
    height: props.style.height + "px",
    marginLeft: (props.frameStart * props.style.width) + "px"
  })  

  // /**
  //  * true = rect is being resized
  //  */
  // const [isActive, setIsActive] = useState(false)
  
  // let frameSize: number = props.editorFrameSize
  // let downX: number
  // let movingX: number
  // let upX: number
  // let tempWidth: number
  // //this is the actual space til the end of the rectangle
  // let endingX: number = props.editorLeftPadding + props.frameEnd*frameSize

  // const onMouseDown = (e: any) => {
  //   setIsActive(true)
  //   props.startEdit()
  //   // downX = e.clientX
  // }

  // const onMouseMove = (e: any) => {
  //   movingX = e.clientX; 
  //   movingX = props.getPosX()

  //   if(isRectSelected){
  //     // Calc the new width of the rectangle after moving the mouse
  //     tempWidth = Math.abs(movingX - (frameSize * props.frameStart + props.editorLeftPadding))
  //     setRectStyle({
  //       ...rectStyle,
  //       width: tempWidth + "px"
  //     })
  //     if(movingX != endingX) setIsRectModified(true);
  //   }
  // }

  // const onMouseUp = (e: any) => {
  //   if(isRectSelected && isRectModified){
  //     upX = e.clientX

  //     const temp = Math.abs(upX-endingX)

  //     let actualWidth: number = temp/frameSize
  //     // If the new width is filling at least 1/3 of the next frame,
  //     // set the endingX to that frame
  //     if (temp % frameSize > frameSize * 0.33){
  //       // I'm in the next frame
  //       actualWidth += 1
  //     }
  //     setRectStyle({
  //       ...rectStyle,
  //       width: actualWidth + "px"
  //     })
  //   }
  // }

  return (
    <div
      style={rectStyle}
      className="ResizableRettangle"
    >
      <div 
        className="ResizableRettangle-left"
      ></div>
      <div 
        className="ResizableRettangle-right"
      ></div>
    </div>
  )
}

export default ResizableRectangle