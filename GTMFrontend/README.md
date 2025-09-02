# GTM Frontend - IP2Location Service

A React-based frontend application for IP address geolocation services.

## Features

- IPv4 address validation
- Real-time location lookup
- Clean, responsive UI
- Error handling and user feedback

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```bash
   VITE_SERVER_IP=localhost
   VITE_SERVER_PORT=3001
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CustomInput.jsx
│   ├── CustomButton.jsx
│   ├── InputDisplay.jsx
│   └── index.js        # Barrel exports
├── utils/              # Utility functions
│   └── validation.js   # IPv4 validation
├── App.jsx             # Main application component
├── App.css             # Application styles
└── main.jsx            # Application entry point
```

## Environment Variables

- `VITE_SERVER_IP` - Backend server IP address
- `VITE_SERVER_PORT` - Backend server port

## Development

The application uses Vite for fast development and building. All environment variables must be prefixed with `VITE_` to be accessible in the frontend code.
