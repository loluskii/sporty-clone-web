#!/usr/bin/env bash

set -e  # Exit on any error

# Change to correct directory
cd ~/west-bet24

# Note: .env file is used by docker-compose directly
# Note: Environment variables are baked into the Docker image at build time
echo "Using pre-built Docker image with embedded environment variables"


# Create network if it doesn't exist,
docker network create sbenet || true

# Stop existing containers
docker compose down || true

# Build images
docker compose build

# Start services
docker compose up -d

# Show running containers
docker ps

echo "Deployment completed successfully"

     
