# Geo-Processor Frontend

This is the frontend component of the Geo-Processor microservice ecosystem. It provides a user interface for processing geographic coordinates to find centroids and bounding boxes.

## Features

- Input latitude/longitude coordinate pairs
- Interactive map visualization with Leaflet.js
- Display centroid and bounding box calculations
- Responsive UI built with DaisyUI components

## Architecture Decision

This project uses a multi-repository approach:

1. **Python FastAPI Service**: Handles the core geo-processing calculations
2. **NestJS API Service**: Provides caching and forwards requests
3. **Next.js Frontend** (this repo): User interface for the system

The multi-repo approach was chosen to:

- Allow independent development and deployment of each component
- Enable different teams to work on different parts of the system
- Provide clear separation of concerns between frontend and backend services

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## API Integration

The frontend connects to the NestJS API service at `http://localhost:3000/api/geo/process-points`. In development mode, if the backend is unavailable, a mock implementation is used to simulate the service.

## Technologies

- Next.js
- TypeScript
- Leaflet.js
- DaisyUI + TailwindCSS

## Documentation

For more detailed documentation, see the [docs folder](./docs).
