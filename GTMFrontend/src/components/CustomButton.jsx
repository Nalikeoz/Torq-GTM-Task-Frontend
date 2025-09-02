import React from 'react'
import './CustomButton.css'

const CustomButton = ({ onClick, children, className }) => (
  <button
    onClick={onClick}
    className={className}
  >
    {children}
  </button>
)

export default CustomButton
