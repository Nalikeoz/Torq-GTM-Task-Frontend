import { useState } from 'react'
import { CustomInput, CustomButton, InputDisplay } from './components'
import './App.css'

// Main App Component
function App() {
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }

  const handleSubmit = () => {
    console.log('Button clicked! Input value:', inputValue)
    // Add your button functionality here
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>IP2Location Service</h1>
      </header>
      
      <main className="app-main">
        <div className="input-group">
          <CustomInput
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter IP address here..."
            className="text-input"
          />
          <CustomButton
            onClick={handleSubmit}
            className="submit-button"
          >
            Submit
          </CustomButton>
        </div>
        
        <InputDisplay value={inputValue} />
      </main>
    </div>
  )
}

export default App
