import React, { useContext } from 'react'
import './style.css'

function NoteRow(props: any) {

  const frames = new Array<JSX.Element>(props.maxLength)
  frames.fill(<div className="noteRow-frame"></div>)
  return (
    <li className="noteRow">
      <span className="noteRow-key">{props.name}</span>
      <ul className="noteRow-frames">
        {frames}
      </ul>
    </li>
  )
}

export default NoteRow