# Geo-Processor Frontend Documentation

## Overview

This frontend application provides a user interface for the Geo-Processor microservice ecosystem. It allows users to input geographic coordinates (latitude/longitude pairs) and visualizes the computed centroid and bounding box on a map.

## Features

- Input form for entering latitude/longitude coordinates
- Interactive map visualization of the points, centroid, and bounding box
- Tabular display of computed results
- Error handling and validation
- Responsive design with DaisyUI components

## Architecture

The application follows a client-server architecture:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Next.js        │     │  NestJS API     │     │  Python         │
│  Frontend       │────▶│  Service        │────▶│  Geo-Processor  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

- **Next.js Frontend**: Provides the user interface and handles data visualization
- **NestJS API**: Acts as a middleware, handles caching and forwards requests
- **Python Service**: Performs the actual geo-processing calculations

## Key Components

- **MapDisplay**: Renders the interactive map with Leaflet.js
- **PointsForm**: Handles user input of coordinate data
- **ResultDisplay**: Shows the processed results in a tabular format
- **API Service**: Communicates with the backend services

## API Endpoints

The frontend communicates with a single API endpoint:

- **POST /api/geo/process-points**
  - Input: JSON payload with an array of points: `{ "points": [{ "lat": number, "lng": number }, ...] }`
  - Output: JSON response with centroid and bounds:
    ```json
    {
      "centroid": { "lat": number, "lng": number },
      "bounds": {
        "north": number,
        "south": number,
        "east": number,
        "west": number
      }
    }
    ```

## Development

### Prerequisites

- Node.js 20+
- npm/yarn

### Setup

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

### Testing

For testing purposes, a mock implementation is provided that will be used as a fallback if the backend services are not available during development.

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Technologies Used

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: Type-safe JavaScript
- **Leaflet.js**: Interactive map library
- **DaisyUI**: Tailwind CSS component library
- **TailwindCSS**: Utility-first CSS framework
