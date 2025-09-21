# OpFlow API Documentation

## Overview
OpFlow provides a REST API for managing workflows, nodes, and governance features.

## Authentication
All API requests require authentication via Keycloak JWT tokens.

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Workflows

#### GET /api/v1/workflows
List all workflows.

**Response:**
```json
{
  "workflows": [
    {
      "id": "workflow-1",
      "name": "Developer Onboarding",
      "status": "active",
      "createdAt": "2025-09-21T00:00:00Z"
    }
  ]
}
```

#### POST /api/v1/workflows
Create a new workflow.

**Request:**
```json
{
  "name": "New Workflow",
  "nodes": [...],
  "connections": {...}
}
```

#### GET /api/v1/workflows/{id}
Get workflow details.

#### PUT /api/v1/workflows/{id}
Update workflow.

#### DELETE /api/v1/workflows/{id}
Delete workflow.

### Nodes

#### GET /api/v1/nodes
List available custom nodes.

**Response:**
```json
{
  "nodes": [
    {
      "name": "jenkins",
      "displayName": "Jenkins",
      "description": "Jenkins CI/CD operations"
    },
    {
      "name": "vault",
      "displayName": "HashiCorp Vault",
      "description": "Secret management operations"
    }
  ]
}
```

### Approvals

#### GET /api/v1/approvals
List pending approvals.

#### POST /api/v1/approvals/{id}/approve
Approve a request.

#### POST /api/v1/approvals/{id}/reject
Reject a request.

### Audit Logs

#### GET /api/v1/audit
Query audit logs.

**Query Parameters:**
- `userId`: Filter by user
- `action`: Filter by action type
- `startDate`: Start date (ISO 8601)
- `endDate`: End date (ISO 8601)
- `limit`: Maximum results (default: 100)

**Response:**
```json
{
  "logs": [
    {
      "id": "log-1",
      "timestamp": "2025-09-21T10:00:00Z",
      "userId": "user-123",
      "action": "workflow_execute",
      "resourceType": "workflow",
      "resourceId": "workflow-1",
      "status": "success"
    }
  ]
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {...}
  }
}
```

Common error codes:
- `VALIDATION_ERROR`: Invalid input
- `AUTHENTICATION_ERROR`: Authentication failed
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `INTERNAL_ERROR`: Server error

## Rate Limiting

- 1000 requests per hour per user
- 10000 requests per hour per service account

## Webhooks

OpFlow supports webhooks for workflow events:

- `workflow.started`
- `workflow.completed`
- `workflow.failed`
- `approval.requested`
- `approval.approved`
- `approval.rejected`

Configure webhook URLs in the n8n UI or via API.

## SDK

For programmatic access, use the OpFlow SDK:

```javascript
const { OpFlowClient } = require('opflow-sdk');

const client = new OpFlowClient({
  baseUrl: 'https://your-opflow-instance.com',
  token: 'your-jwt-token'
});

// Execute a workflow
const result = await client.workflows.execute('workflow-id', inputData);
```

## Monitoring

Monitor OpFlow health via:

- `/health`: Basic health check
- `/metrics`: Prometheus metrics
- `/status`: Detailed status information

## Security

- All communications use HTTPS
- JWT tokens expire after 1 hour
- Sensitive data is encrypted at rest
- Audit logs are immutable

## Support

For API support:
- Check this documentation
- Review application logs
- Contact the development team