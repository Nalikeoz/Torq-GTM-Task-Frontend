import { useState } from 'react'
import { CustomInput, CustomButton } from './components'
import { isValidIPv4 } from './utils/validation'
import './App.css'

// Main App Component
function App() {
  const [inputValue, setInputValue] = useState('')
  const [location, setLocation] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }

  const handleSubmit = async () => {
    // reset error message and location
    setErrorMessage('')
    setLocation('')

    if (!isValidIPv4(inputValue)) {
      setErrorMessage('Please enter a valid IPv4 address')
      return
    }
    
    const response = await fetch(`${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/v1/find-country?ip=${inputValue}`)
    const data = await response.json()

    if (!response.ok) {
      // handle errors from server
      const errorMessage = data.error
      setErrorMessage(errorMessage)
    }
    else {
      const parsedLocation = `${data.country}, ${data.city}`
      setLocation(parsedLocation)
    }
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
            placeholder="Enter IPv4 address (e.g., 8.8.8.8)"
            className="text-input"
          />
          <CustomButton
            onClick={handleSubmit}
            className="submit-button"
          >
            Find
          </CustomButton>
        </div>
        
        {errorMessage && (
          <div className="error-display">
            <p>{errorMessage}</p>
          </div>
        )}
        
        {location && (
          <div className="location-display">
            <p>{location}</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
