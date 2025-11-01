#!/usr/bin/env bash

set -e  # Exit on any error

# Change to correct directory
cd ~/west-bet24

# Build image locally with server's .env file
echo "Building Docker image with server's .env file"
echo "Checking .env file contents:"
head -5 .env || echo "No .env file found"
echo "Setting environment variables for build:"
set -a
source .env
set +a
echo "All environment variables loaded:"
env | grep ^VITE_

# Create network if it doesn't exist
docker network create sbenet || true

# Stop existing containers
docker compose down || true

# Build with all environment variables passed as build args
docker compose build --build-arg VITE_BASE_URL="$VITE_BASE_URL" \
  --build-arg VITE_SITE_URL="$VITE_SITE_URL" \
  --build-arg VITE_NEW_BASE_API="$VITE_NEW_BASE_API" \
  --build-arg VITE_ENCRYPT_SECRET_KEY="$VITE_ENCRYPT_SECRET_KEY" \
  --build-arg VITE_APP_KEY="$VITE_APP_KEY" \
  --build-arg VITE_CLIENT_ID="$VITE_CLIENT_ID" \
  --build-arg VITE_CURRENCY="$VITE_CURRENCY" \
  --build-arg VITE_WTH_PERC="$VITE_WTH_PERC" \
  --build-arg VITE_EXCISE_DUTY="$VITE_EXCISE_DUTY" \
  --build-arg VITE_FAST_ADD_AMOUNTS="$VITE_FAST_ADD_AMOUNTS" \
  --build-arg VITE_TIMEZONE="$VITE_TIMEZONE" \
  --build-arg VITE_MaxCombinationsByGrouping="$VITE_MaxCombinationsByGrouping" \
  --build-arg VITE_MaxCouponCombinations="$VITE_MaxCouponCombinations" \
  --build-arg VITE_MinBonusOdd="$VITE_MinBonusOdd" \
  --build-arg VITE_MinGroupingsBetStake="$VITE_MinGroupingsBetStake" \
  --build-arg VITE_MaxGroupingsBetStake="$VITE_MaxGroupingsBetStake" \
  --build-arg VITE_MinBetStake="$VITE_MinBetStake" \
  --build-arg VITE_StakeInnerMod0Combination="$VITE_StakeInnerMod0Combination" \
  --build-arg VITE_XPRESS_LAUNCH_URL="$VITE_XPRESS_LAUNCH_URL" \
  --build-arg VITE_XPRESS_PRIVATE_KEY="$VITE_XPRESS_PRIVATE_KEY" \
  --build-arg VITE_XPRESS_PUBLIC_KEY="$VITE_XPRESS_PUBLIC_KEY" \
  --build-arg VITE_MQTT_URI="$VITE_MQTT_URI"

# Start services
docker compose up -d

# Show running containers
docker ps

# Verify environment variables in built files
echo "Verifying environment variables in Docker image..."
if docker ps | grep -q west-bet24; then
    echo "Checking main JS bundle for environment variables:"
    MAIN_JS=$(docker exec west-bet24-sportsbook-web-1 find /usr/share/nginx/html/assets -name "index-*.js" | head -1)
    echo "Main JS file: $MAIN_JS"
    echo "Sample content from main JS (first 500 chars):"
    docker exec west-bet24-sportsbook-web-1 head -c 500 "$MAIN_JS" 2>/dev/null || echo "Could not read main JS file"
    echo "\nSearching for 'api' in main JS:"
    docker exec west-bet24-sportsbook-web-1 grep -o "[a-zA-Z0-9:/.-]*api[a-zA-Z0-9:/.-]*" "$MAIN_JS" 2>/dev/null | head -5 || echo "No API references found"
    echo "\nSearching for 'bet24' in all files:"
    docker exec west-bet24-sportsbook-web-1 grep -r "bet24" /usr/share/nginx/html/ 2>/dev/null | head -3 || echo "No bet24 references found"
    echo "\nSearching for server's API URL in built files:"
    docker exec west-bet24-sportsbook-web-1 grep -r "api.prod.sportsbookengine.com" /usr/share/nginx/html/ 2>/dev/null | head -3 || echo "Server API URL not found in built files"
else
    echo "Container west-bet24-sportsbook-web-1 is not running"
fi

echo "Deployment completed successfully"
