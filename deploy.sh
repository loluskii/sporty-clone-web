#!/usr/bin/env bash

set -e  # Exit on any error

echo "=== Vue.js App Deployment ==="
echo "Current directory: $(pwd)"
echo "Files in directory:"
ls -la

echo "=== Creating Docker network ==="
docker network create sbenet || echo "Network already exists"

echo "=== Stopping existing containers ==="
docker compose down || echo "No containers to stop"

echo "=== Building Vue.js app with Docker ==="
docker compose build

echo "=== Starting Vue.js app ==="
docker compose up -d

echo "=== Checking running containers ==="
docker ps

echo "=== Deployment completed successfully ==="
echo "App should be available on port 3000"

     
