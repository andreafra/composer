import React, { useState } from 'react'
import './style.css'

function Button(props: any) {

  function handleClick() {
    props.action()
  }

  return (
  <button onClick={handleClick}>
    {props.name}
  </button>
  )
}

export default Button