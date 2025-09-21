# OpFlow - n8n-based DevOps Automation Platform

## Overview
OpFlow is a low-code automation platform built on n8n, designed to streamline DevOps operational tasks. It provides self-service capabilities for developers while maintaining strong governance and compliance.

## Prerequisites
- Docker and Docker Compose
- Bash shell environment
- Available ports:
  - 5678 (n8n)
  - 5432 (PostgreSQL)
  - 8080 (Keycloak)

## Quick Start
1. Clone this repository
2. Run the setup script:
   ```bash
   chmod +x scripts/setup-environment.sh
   ./scripts/setup-environment.sh
   ```
3. Access the services:
   - n8n: http://localhost:5678
   - Keycloak admin: http://localhost:8080

## Components
- **n8n**: Core automation platform
- **PostgreSQL**: Database for n8n and Keycloak
- **Keycloak**: SSO authentication provider

## Configuration
Environment configuration is managed through `docker-compose.yml`. Key configurations:
- Database credentials
- Keycloak realm and client settings
- Service ports and network settings

## Security Notes
- Default credentials are for development only
- Change all passwords in production
- Configure proper SSL/TLS in production
- Review and customize RBAC settings

## Performance Requirements
As per our constitution:
- API response time: < 500ms (99th percentile)
- System monitoring enabled
- Regular performance optimization

## Testing
- Unit test coverage: minimum 80%
- Integration tests for all critical paths
- Performance testing suite included

## Documentation
Detailed documentation for:
- Custom connectors
- Workflow templates
- Governance framework
- Security configurations

## Support
For issues and support:
1. Check existing documentation
2. Review logs and monitoring
3. Contact the DevOps team