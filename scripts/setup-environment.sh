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

# Start services
echo "Starting OpFlow services..."
docker-compose up -d

# Wait for services to be up
check_service "PostgreSQL" 5432 || exit 1
check_service "Keycloak" 8080 || exit 1
check_service "n8n" 5678 || exit 1

echo "All services are up and running!"

# Initialize Keycloak configuration
echo "Configuring Keycloak..."
docker-compose exec keycloak /opt/keycloak/bin/kcadm.sh config credentials \
    --server http://localhost:8080/auth \
    --realm master \
    --user admin \
    --password admin

# Create n8n realm and client
docker-compose exec keycloak /opt/keycloak/bin/kcadm.sh create realms \
    -s realm=n8n \
    -s enabled=true

docker-compose exec keycloak /opt/keycloak/bin/kcadm.sh create clients \
    -r n8n \
    -s clientId=n8n-client \
    -s enabled=true \
    -s publicClient=false \
    -s secret=n8n-secret \
    -s redirectUris='["http://localhost:5678/*"]'

echo "OpFlow environment setup complete!"