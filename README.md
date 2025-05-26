# Geo-Processor Frontend

This is the frontend component of the Geo-Processor microservice ecosystem. It provides a user interface for processing geographic coordinates to find centroids and bounding boxes with real-time map visualization.

## Features

- 📍 **Interactive Coordinate Input**: Enter latitude/longitude pairs through a user-friendly form with real-time validation
- 🗺️ **Dynamic Map Visualization**: Interactive map powered by Leaflet.js displaying:
  - Input coordinate points as markers
  - Calculated centroid point
  - Bounding box visualization
  - Automatic map fitting to show all points
- 📊 **Results Display**: Tabular view of computed centroid and bounding box coordinates
- 🎨 **Responsive Design**: Modern UI built with DaisyUI and TailwindCSS
- 🔄 **Fallback Support**: Automatic fallback to mock implementation during development
- 🌓 **Theme Support**: Light/dark theme switching capability
- ✅ **Input Validation**: Comprehensive validation for coordinate ranges and formats

## Architecture

This project uses a multi-repository microservice architecture:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Next.js        │     │  NestJS API     │     │  Python         │
│  Frontend       │────▶│  Service        │────▶│  Geo-Processor  │
│  (This Repo)    │     │  (Caching)      │     │  (FastAPI)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **Next.js Frontend** (this repository): User interface and visualization
2. **NestJS API Service**: Middleware for caching and request forwarding
3. **Python FastAPI Service**: Core geo-processing calculations

**Benefits of this approach:**

- Independent development and deployment cycles
- Technology-specific optimization (React for UI, Python for geo-calculations)
- Horizontal scaling capabilities
- Clear separation of concerns

## Getting Started

### Prerequisites

- Node.js 22+ (recommended)
- npm, yarn, or pnpm package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd geo-processor-frontend

# Install dependencies
npm install
```

### Development

```bash
# Start the development server with Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

The development server includes:

- Hot reload for instant updates
- Turbopack for faster builds
- Automatic fallback to mock data if backend is unavailable

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Docker Deployment

```bash
# Using Docker Compose
docker-compose up -d

# Or build manually
docker build -f docker/Dockerfile -t geo-processor-frontend .
docker run -p 3000:3000 geo-processor-frontend
```

## API Integration

### Endpoints

- **POST** `/api/geo/process-points` - Process coordinate points

  ```json
  // Request
  {
    "points": [
      { "lat": 40.7128, "lng": -74.0060 },
      { "lat": 34.0522, "lng": -118.2437 }
    ]
  }

  // Response
  {
    "centroid": { "lat": 37.3825, "lng": -96.1249 },
    "bounds": {
      "north": 40.7128,
      "south": 34.0522,
      "east": -74.0060,
      "west": -118.2437
    }
  }
  ```

- **GET** `/api/health` - Health check endpoint

### Configuration

Environment variables:

- `NEST_PUBLIC_API_BASE_URL`: Backend API URL (default: `http://localhost:3000`)
- `NODE_ENV`: Environment mode (`development` | `production`)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (fallback endpoints)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ApiStatus.tsx      # API connection status
│   ├── MapDisplay.tsx     # Interactive map component
│   ├── Navbar.tsx         # Navigation bar
│   ├── PointsForm.tsx     # Coordinate input form
│   ├── ResultDisplay.tsx  # Results table
│   └── ThemeSwitcher.tsx  # Theme toggle
├── config/                # Configuration files
├── services/              # API and mock services
└── types/                 # TypeScript type definitions
```

## Technologies

### Core Stack

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[React 19](https://react.dev/)** - UI library with latest features

### UI & Styling

- **[TailwindCSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[DaisyUI](https://daisyui.com/)** - Tailwind CSS component library

### Mapping & Visualization

- **[Leaflet.js](https://leafletjs.com/)** - Interactive map library
- **[React-Leaflet](https://react-leaflet.js.org/)** - React bindings for Leaflet

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting
- **[Turbopack](https://turbo.build/pack)** - Fast bundler for development
- **Docker** - Containerization support

## Input Format

The application accepts coordinates in the following formats:

```
# Comma-separated (lat, lng)
40.7128, -74.0060
34.0522, -118.2437

# Space-separated
40.7128 -74.0060
34.0522 -118.2437

# One coordinate per line
40.7128, -74.0060
34.0522, -118.2437
```

**Validation Rules:**

- Latitude: -90 to 90 degrees
- Longitude: -180 to 180 degrees
- Minimum 1 coordinate pair required
- Maximum reasonable limit to prevent performance issues

## Development Features

- **Mock Service**: Automatic fallback when backend is unavailable
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Visual indicators for async operations
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Accessibility**: WCAG compliant components and keyboard navigation

## Documentation

For detailed technical documentation, API specifications, and development guides, see the [docs folder](./docs).
