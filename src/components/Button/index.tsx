import React, { useState } from 'react'
import './style.css'

/**
 * A component that accepts a prop called `name`
 * and a callback prop called `action`.
 */
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