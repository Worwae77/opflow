#!/bin/bash

# Function to check if a service is healthy
check_service() {
    local service=$1
    local port=$2
    local max_attempts=30
    local attempt=1

    echo "Checking $service health..."
    while ! nc -z localhost $port; do
        if [ $attempt -eq $max_attempts ]; then
            echo "$service failed to start after $max_attempts attempts"
            return 1
        fi
        echo "Waiting for $service... (attempt $attempt/$max_attempts)"
        sleep 5
        ((attempt++))
    done
    echo "$service is up and running"
    return 0
}

# Start test containers
echo "Starting test environment..."
docker-compose -f docker-compose.test.yml up -d

# Wait for services to be ready
check_service "PostgreSQL" 5432 || exit 1
check_service "Jenkins" 8080 || exit 1
check_service "Vault" 8200 || exit 1
check_service "Keycloak" 8180 || exit 1
check_service "MockServer" 9000 || exit 1

# Install test dependencies
echo "Installing test dependencies..."
npm install

# Run tests
echo "Running tests..."
npm test

# Cleanup
echo "Cleaning up test environment..."
docker-compose -f docker-compose.test.yml down