import React from 'react'
import './CustomInput.css'

const CustomInput = ({ value, onChange, placeholder, className }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={className}
  />
)

export default CustomInput
