import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

// Mock the components to isolate App component testing
vi.mock('./components', () => ({
  CustomInput: ({ value, onChange, placeholder, className }) => (
    <input
      data-testid="custom-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  ),
  CustomButton: ({ onClick, children, className }) => (
    <button
      data-testid="custom-button"
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  )
}))

// Mock the validation utility
vi.mock('../utils/validation', () => ({
  isValidIPv4: vi.fn()
}))

// Mock fetch globally
global.fetch = vi.fn()

describe('App Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    // Reset fetch mock
    global.fetch.mockClear()
  })

  describe('Rendering', () => {
    it('should render the header with correct title', () => {
      render(<App />)
      
      const header = screen.getByRole('heading', { level: 1 })
      expect(header).toBeInTheDocument()
      expect(header).toHaveTextContent('IP2Location Service')
    })

    it('should render input field with correct placeholder', () => {
      render(<App />)
      
      const input = screen.getByPlaceholderText('Enter IPv4 address (e.g., 8.8.8.8)')
      expect(input).toBeInTheDocument()
    })

    it('should render submit button with correct text', () => {
      render(<App />)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Find')
    })

    it('should not display error message initially', () => {
      render(<App />)
      
      const errorDisplay = screen.queryByTestId('error-display')
      expect(errorDisplay).not.toBeInTheDocument()
    })

    it('should not display location initially', () => {
      render(<App />)
      
      const locationDisplay = screen.queryByTestId('location-display')
      expect(locationDisplay).not.toBeInTheDocument()
    })
  })

  describe('User Input Handling', () => {
    it('should update input value when user types', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      const input = screen.getByPlaceholderText('Enter IPv4 address (e.g., 8.8.8.8)')
      await user.type(input, '192.168.1.1')
      
      expect(input).toHaveValue('192.168.1.1')
    })

    it('should handle input change events', () => {
      render(<App />)
      
      const input = screen.getByPlaceholderText('Enter IPv4 address (e.g., 8.8.8.8)')
      fireEvent.change(input, { target: { value: '10.0.0.1' } })
      
      expect(input).toHaveValue('10.0.0.1')
    })
  })

  describe('Form Submission - Invalid IP', () => {
    it('should show error message for invalid IPv4 address', async () => {
      const { isValidIPv4 } = await import('../utils/validation')
      isValidIPv4.mockReturnValue(false)
      
      const user = userEvent.setup()
      render(<App />)
      
      const input = screen.getByPlaceholderText('Enter IPv4 address (e.g., 8.8.8.8)')
      const button = screen.getByRole('button')
      
      await user.type(input, 'invalid-ip')
      await user.click(button)
      
      expect(screen.getByText('Please enter a valid IPv4 address')).toBeInTheDocument()
    })

    it('should clear location when showing error for invalid IP', async () => {
      const { isValidIPv4 } = await import('../utils/validation')
      isValidIPv4.mockReturnValue(false)
      
      const user = userEvent.setup()
      render(<App />)
      
      const input = screen.getByPlaceholderText('Enter IPv4 address (e.g., 8.8.8.8)')
      const button = screen.getByRole('button')
      
      // First set a valid IP and get location
      isValidIPv4.mockReturnValue(true)
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ country: 'Test Country', city: 'Test City' })
      })
      
      await user.type(input, '8.8.8.8')
      await user.click(button)
      
      await waitFor(() => {
        expect(screen.getByText('Test Country, Test City')).toBeInTheDocument()
      })
      
      // Now test with invalid IP
      isValidIPv4.mockReturnValue(false)
      await user.clear(input)
      await user.type(input, 'invalid-ip')
      await user.click(button)
      
      expect(screen.getByText('Please enter a valid IPv4 address')).toBeInTheDocument()
      expect(screen.queryByText('Test Country, Test City')).not.toBeInTheDocument()
    })
  })

  describe('Form Submission - Valid IP', () => {
    it('should make API call with correct URL for valid IP', async () => {
      const { isValidIPv4 } = await import('../utils/validation')
      isValidIPv4.mockReturnValue(true)
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ country: 'United States', city: 'Mountain View' })
      })
      
      const user = userEvent.setup()
      render(<App />)
      
      const input = screen.getByPlaceholderText('Enter IPv4 address (e.g., 8.8.8.8)')
      const button = screen.getByRole('button')
      
      await user.type(input, '8.8.8.8')
      await user.click(button)
      
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:1234/v1/find-country?ip=8.8.8.8'
      )
    })

    it('should display location when API call succeeds', async () => {
      const { isValidIPv4 } = await import('../utils/validation')
      isValidIPv4.mockReturnValue(true)
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ country: 'United States', city: 'Mountain View' })
      })
      
      const user = userEvent.setup()
      render(<App />)
      
      const input = screen.getByPlaceholderText('Enter IPv4 address (e.g., 8.8.8.8)')
      const button = screen.getByRole('button')
      
      await user.type(input, '8.8.8.8')
      await user.click(button)
      
      await waitFor(() => {
        expect(screen.getByText('United States, Mountain View')).toBeInTheDocument()
      })
    })

    it('should clear error message when API call succeeds', async () => {
      const { isValidIPv4 } = await import('../utils/validation')
      isValidIPv4.mockReturnValue(true)
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ country: 'United States', city: 'Mountain View' })
      })
      
      const user = userEvent.setup()
      render(<App />)
      
      const input = screen.getByPlaceholderText('Enter IPv4 address (e.g., 8.8.8.8)')
      const button = screen.getByRole('button')
      
      // First show an error
      isValidIPv4.mockReturnValue(false)
      await user.type(input, 'invalid-ip')
      await user.click(button)
      
      expect(screen.getByText('Please enter a valid IPv4 address')).toBeInTheDocument()
      
      // Now test with valid IP
      isValidIPv4.mockReturnValue(true)
      await user.clear(input)
      await user.type(input, '8.8.8.8')
      await user.click(button)
      
      await waitFor(() => {
        expect(screen.getByText('United States, Mountain View')).toBeInTheDocument()
        expect(screen.queryByText('Please enter a valid IPv4 address')).not.toBeInTheDocument()
      })
    })
  })

  describe('API Error Handling', () => {
    it('should display server error message when API call fails', async () => {
      const { isValidIPv4 } = await import('../utils/validation')
      isValidIPv4.mockReturnValue(true)
      
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Server error: IP not found' })
      })
      
      const user = userEvent.setup()
      render(<App />)
      
      const input = screen.getByPlaceholderText('Enter IPv4 address (e.g., 8.8.8.8)')
      const button = screen.getByRole('button')
      
      await user.type(input, '8.8.8.8')
      await user.click(button)
      
      await waitFor(() => {
        expect(screen.getByText('Server error: IP not found')).toBeInTheDocument()
      })
    })

    it('should clear location when API call fails', async () => {
      const { isValidIPv4 } = await import('../utils/validation')
      isValidIPv4.mockReturnValue(true)
      
      // First successful call
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ country: 'Test Country', city: 'Test City' })
      })
      
      const user = userEvent.setup()
      render(<App />)
      
      const input = screen.getByPlaceholderText('Enter IPv4 address (e.g., 8.8.8.8)')
      const button = screen.getByRole('button')
      
      await user.type(input, '8.8.8.8')
      await user.click(button)
      
      await waitFor(() => {
        expect(screen.getByText('Test Country, Test City')).toBeInTheDocument()
      })
      
      // Now failed call
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Server error' })
      })
      
      await user.clear(input)
      await user.type(input, '1.1.1.1')
      await user.click(button)
      
      await waitFor(() => {
        expect(screen.getByText('Server error')).toBeInTheDocument()
        expect(screen.queryByText('Test Country, Test City')).not.toBeInTheDocument()
      })
    })
  })

  describe('State Management', () => {
    it('should reset both error message and location on new submission', async () => {
      const { isValidIPv4 } = await import('../utils/validation')
      isValidIPv4.mockReturnValue(true)
      
      const user = userEvent.setup()
      render(<App />)
      
      const input = screen.getByPlaceholderText('Enter IPv4 address (e.g., 8.8.8.8)')
      const button = screen.getByRole('button')
      
      // First submission - success
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ country: 'Country1', city: 'City1' })
      })
      
      await user.type(input, '8.8.8.8')
      await user.click(button)
      
      await waitFor(() => {
        expect(screen.getByText('Country1, City1')).toBeInTheDocument()
      })
      
      // Second submission - different result
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ country: 'Country2', city: 'City2' })
      })
      
      await user.clear(input)
      await user.type(input, '1.1.1.1')
      await user.click(button)
      
      await waitFor(() => {
        expect(screen.getByText('Country2, City2')).toBeInTheDocument()
        expect(screen.queryByText('Country1, City1')).not.toBeInTheDocument()
      })
    })
  })
})
