# Docker Setup for Geo Processor Frontend

This document explains how to run the Geo Processor Frontend application using Docker.

## Prerequisites

- Docker Engine 20.10 or later
- Docker Compose 2.0 or later

## Quick Start

1. **Clone the repository and navigate to the project directory:**

   ```bash
   cd /home/cristian/Proyectos/codebranch/geo-processor-frontend
   ```

2. **Create your environment file:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your specific configuration values.

3. **Build and run the application:**

   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`

## Docker Commands

### Build the image

```bash
docker-compose build
```

### Run in development mode

```bash
docker-compose up
```

### Run in background (detached mode)

```bash
docker-compose up -d
```

### View logs

```bash
docker-compose logs -f geo-processor-frontend
```

### Stop the application

```bash
docker-compose down
```

### Clean up (remove containers, networks, and volumes)

```bash
docker-compose down -v --remove-orphans
```

## Environment Variables

The application uses the following environment variables from the `.env` file:

- `NODE_ENV`: Application environment (development/production)
- `NEST_PUBLIC_API_BASE_URL`: Base URL for the API
- Add any additional environment variables your application needs

## Health Check

The application includes a health check endpoint at `/api/health` that returns:

```json
{
  "status": "healthy",
  "timestamp": "2025-05-26T...",
  "service": "geo-processor-frontend"
}
```

## Docker Configuration Details

### Dockerfile Features

- **Base Image**: Node.js 22 Alpine for smaller image size
- **Multi-stage build**: Optimized for production deployment
- **Non-root user**: Runs as `nextjs` user for security
- **Standalone output**: Uses Next.js standalone mode for better performance

### Docker Compose Features

- **Port mapping**: Maps container port 3000 to host port 3000
- **Environment files**: Automatically loads `.env` file
- **Health checks**: Monitors application health
- **Restart policy**: Automatically restarts on failure

## Troubleshooting

### Port already in use

If port 3000 is already in use, you can change it in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000" # Maps host port 3001 to container port 3000
```

### Build issues

If you encounter build issues, try:

```bash
docker-compose build --no-cache
```

### Permission issues

Make sure Docker has the necessary permissions to access the project directory.

## Production Deployment

For production deployment, consider:

1. Using a reverse proxy (nginx, traefik)
2. Setting up SSL certificates
3. Configuring proper logging
4. Setting up monitoring and alerting
5. Using Docker secrets for sensitive environment variables
