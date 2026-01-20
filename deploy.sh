#!/usr/bin/env bash

set -e  # Exit on any error

echo "=== Vue.js App Deployment from Registry ==="
echo "Current directory: $(pwd)"
echo "VERSION: ${VERSION:-latest}"

echo "=== Creating Docker network ==="
docker network create sbenet || echo "Network already exists"

echo "=== Stopping existing containers ==="
docker compose down || echo "No containers to stop"

echo "=== Pulling latest image from registry ==="
export VERSION=${VERSION:-latest}
docker compose pull

echo "=== Starting Vue.js app ==="
docker compose up -d

echo "=== Checking running containers ==="
docker ps

echo "=== Deployment completed successfully ==="
echo "App should be available on port 3000"