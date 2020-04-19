import React, {useState, useEffect} from 'react'
import './style.css'

interface RectStyle {
  backgroundColor: string
  width: string
}

function Rect(props: any){

  // Check if future if there are any performance issues?
  const [style, setStyle]: [RectStyle, any] = useState({
    backgroundColor: props.color,
    width: (props.frameEnd - props.frameStart + 1) * props.frameSize + "px",
  })  

  // True if I'm editing this rectangle
  const [isActive, setIsActive] = useState(false)
  
  // If I'm dragging the left handle (else it's the right one)
  const [isLeftHandleActive, setIsLeftHandleActive] = useState(false)

  useEffect(() => {
    if(props.shouldEdit && isActive) {
      // If I'm editing the rectangle
      let newWidth: number = 0
      if(isLeftHandleActive) {
        // TODO: Handle left handle
      } else {
        // TODO: Handle right handle
        //newWidth = Math.abs(props.x - (props.frameSize * props.frameStart))
      }
      setStyle({
        ...style,
        width: newWidth
      })
    }
  }, [props.x])

  useEffect(() => {
    if(props.shouldEdit === false) {
      if(isActive) {
        // Handle mouse up

        // push the data up to the parent
        props.update({
          //...
        })
        // finally
        setIsActive(false)
      }
    }
  }, [props.shouldEdit])

  // let frameSize: number = props.editorFrameSize
  // let downX: number
  // let movingX: number
  // let upX: number
  // let tempWidth: number
  // //this is the actual space til the end of the rectangle
  // let endingX: number = props.editorLeftPadding + props.frameEnd*frameSize

  // const onMouseMove = (e: any) => {
  //   movingX = e.clientX; 
  //   movingX = props.getPosX()

  //   if(isRectSelected){
  //     // Calc the new width of the rectangle after moving the mouse
  //     tempWidth = Math.abs(movingX - (frameSize * props.frameStart + props.editorLeftPadding))
  //     setStyle({
  //       ...style,
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
  //     setStyle({
  //       ...style,
  //       width: actualWidth + "px"
  //     })
  //   }
  // }

  return (
    <div
      className="Rect"
      style={style}

      onMouseDown={() => setIsActive(true)}
    >
      <div 
        className="Rect-left"
        onMouseDown={() => setIsLeftHandleActive(true)}
      ></div>
      <div 
        className="Rect-right"
        onMouseDown={() => setIsLeftHandleActive(false)}
      ></div>
    </div>
  )
}

export default Rect