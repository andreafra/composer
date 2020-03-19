import React from 'react'
import './style.css'
import Button from 'components/Button'


function App() {

  const printCiao = () => {
    console.log("Ciao")
  }

  return (
    <div className="App">
      <Button name="Ciao" action={() => printCiao()}/>
    </div>
  )
}

export default App
