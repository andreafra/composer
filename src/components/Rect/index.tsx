import React, {useState, useEffect} from 'react'
import './style.css'

interface RectStyle {
  backgroundColor: string
  width: string
  marginLeft: string
}

function Rect(props: any){

  // Check if future if there are any performance issues?
  const [style, setStyle]: [RectStyle, any] = useState({
    backgroundColor: props.color,
    width: (props.frameEnd - props.frameStart + 1) * props.frameSize + "px",
    marginLeft: (props.frameStart - 1) + props.frameSize + "px",
  })  

  // True if I'm editing this rectangle
  const [isActive, setIsActive] = useState(false)
  
  // If I'm dragging the left handle (else it's the right one)
  const [isLeftHandleActive, setIsLeftHandleActive] = useState(false)
  //last used pixel
  let endingX: number = (props.frameEnd*props.frameSize)+ props.leftPadding

  useEffect(() => {
    if(props.shouldEdit && isActive) {
      // If I'm editing the rectangle
      let newWidth: number = 0
      let newMargin: number = (props.frameStart - 1) + props.frameSize
      if(isLeftHandleActive) {
        newWidth = (endingX - props.x)
        newMargin = (props.frameStart - 1) + props.frameSize - ((props.frameStart * props.frameSize) - props.x)
      } else {
        newWidth = props.x - (props.frameSize * props.frameStart)
      }
      setStyle({
        ...style,
        width: newWidth,
        marginLeft: newMargin
      })
    }
  }, [props.x])

  useEffect(() => {
    if(props.shouldEdit === false) {
      if(isActive) {
        //the delta of space where the rect has been moved
        let  temp: number  = props.x - endingX 
        //the width of the rect
        let actualWidth : number = (props.frameEnd - props.frameStart + 1) * props.frameSize
        //the number of frames that has to be summed
        let numberOfFrames: number = (temp/props.frameSize) 
        //if we want to only add a frame, number of frames will be < 1. We need to separate
        //number of frames >1 or <1
        if (numberOfFrames > 1){
          actualWidth = actualWidth*numberOfFrames
          if (temp % props.frameSize > props.frameSize * 0.33){
            // I'm in the next frame
            actualWidth += (numberOfFrames*props.frameSize)
          }
        }
        else {
          console.log(temp)
          if (temp % props.frameSize > props.frameSize * 0.33){
            console.log(temp%props.frameSize)
            // I'm in the next frame
            actualWidth += props.frameSize
            console.log(actualWidth)
          }
        }
        
        console.log(numberOfFrames)
        
        // Handle mouse up
        // push the data up to the parent
        setStyle({
          ...style,
          width: actualWidth
        })
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