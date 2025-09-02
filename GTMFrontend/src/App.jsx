import { useState } from 'react'
import { CustomInput, CustomButton } from './components'
import './App.css'

// Main App Component
function App() {
  const [inputValue, setInputValue] = useState('')
  const [location, setLocation] = useState('')

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }

  const fetchLocationFromIP = async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/v1/find-country?ip=${inputValue}`)
    const data = await response.json()

    if (!response.ok) {
      const errorMessage = data.error
      setLocation(errorMessage)
    }
    else {
      const parsedLocation = `Location: ${data.country}, ${data.city}`
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
            placeholder="Enter IP address here..."
            className="text-input"
          />
          <CustomButton
            onClick={fetchLocationFromIP}
            className="submit-button"
          >
            Submit
          </CustomButton>
        </div>
      </main>
      <div className="location-display">
          <p>{location}</p>
        </div>
    </div>
  )
}

export default App
