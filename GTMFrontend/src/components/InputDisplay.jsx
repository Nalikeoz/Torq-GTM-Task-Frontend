import React from 'react'
import './InputDisplay.css'

const InputDisplay = ({ value }) => {
  if (!value) return null
  
  return (
    <div className="input-display">
      <p>You typed: <strong>{value}</strong></p>
    </div>
  )
}

export default InputDisplay
