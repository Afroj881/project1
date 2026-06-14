# API Documentation

## Authentication

All API endpoints require authentication via JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Some endpoints require specific roles:
- `admin`: Full access to all endpoints
- `manager`: Can access activity logs and project-specific data
- `team_member`: Can access own activity and assigned tasks
- `client`: Limited access to own data

## Error Responses

All errors follow a standard format:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Error description",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Common status codes:
- `200`: Success
- `400`: Bad Request (validation error)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Activity Log API

### Retrieve Activity Logs

**Endpoint**: `GET /api/activity`

**Authentication**: Required

**Query Parameters**:
| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| page | number | Page number (default: 1) | No |
| limit | number | Items per page, max 100 (default: 20) | No |
| userId | string | Filter by user ID | No |
| action | string | Filter by action type | No |
| entity | string | Filter by entity type | No |
| projectId | string | Filter by project ID | No |
| startDate | date | Filter from date (ISO format) | No |
| endDate | date | Filter to date (ISO format) | No |

**Valid Actions**:
```
PROJECT_CREATED, PROJECT_UPDATED, TASK_CREATED, TASK_ASSIGNED,
TASK_STATUS_CHANGED, COMMENT_ADDED, FILE_UPLOADED, INVOICE_GENERATED,
INVOICE_PAID, TEAM_INVITATION_SENT, ROLE_UPDATED
```

**Valid Entities**:
```
PROJECT, TASK, COMMENT, FILE, INVOICE, TEAM, CLIENT, USER
```

**Example Request**:
```bash
curl -X GET "http://localhost:3000/api/activity?page=1&limit=20&action=TASK_ASSIGNED&projectId=60d6c104c1f2d4a8e8a1b2c3" \
  -H "Authorization: Bearer your_token"
```

**Example Response**:
```json
{
  "status": "success",
  "data": [
    {
      "_id": "60d6c104c1f2d4a8e8a1b2c4",
      "userId": "60d6c104c1f2d4a8e8a1b1f1",
      "action": "TASK_ASSIGNED",
      "entity": "TASK",
      "entityId": "60d6c104c1f2d4a8e8a1b2c5",
      "description": "Task 'Design Homepage' assigned",
      "projectId": "60d6c104c1f2d4a8e8a1b2c3",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "user": {
        "_id": "60d6c104c1f2d4a8e8a1b1f1",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "pagination": {
    "total": 250,
    "page": 1,
    "limit": 20,
    "pages": 13
  }
}
```

### Get Activity Summary

**Endpoint**: `GET /api/activity/summary`

**Authentication**: Required

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| projectId | string | Filter by project ID |
| userId | string | Filter by user ID |
| days | number | Number of days to look back (default: 30) |

**Example Response**:
```json
{
  "status": "success",
  "data": {
    "summary": {
      "TASK_ASSIGNED": 25,
      "TASK_STATUS_CHANGED": 18,
      "COMMENT_ADDED": 42,
      "PROJECT_UPDATED": 5,
      "TEAM_INVITATION_SENT": 3
    },
    "totalActivities": 93,
    "period": {
      "days": 30,
      "startDate": "2023-12-16T10:30:00.000Z"
    }
  }
}
```

### Get User Activity

**Endpoint**: `GET /api/activity/user/:userId`

**Authentication**: Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| userId | string | User ID |

**Query Parameters**: Same as `/api/activity` (except userId filter)

**Example Request**:
```bash
curl -X GET "http://localhost:3000/api/activity/user/60d6c104c1f2d4a8e8a1b1f1?page=1&limit=20" \
  -H "Authorization: Bearer your_token"
```

### Get Project Activity

**Endpoint**: `GET /api/activity/project/:projectId`

**Authentication**: Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| projectId | string | Project ID |

### Get Entity Activity

**Endpoint**: `GET /api/activity/entity/:entity/:entityId`

**Authentication**: Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| entity | string | Entity type (PROJECT, TASK, COMMENT, etc.) |
| entityId | string | Entity ID |

## Email Management API

### Process Email Queue

**Endpoint**: `POST /api/email/process-queue`

**Authentication**: Required (admin role)

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Max emails to process (default: 10) |

**Example Request**:
```bash
curl -X POST "http://localhost:3000/api/email/process-queue?limit=20" \
  -H "Authorization: Bearer your_token"
```

**Example Response**:
```json
{
  "status": "success",
  "message": "Email queue processed successfully",
  "data": {
    "processed": 18,
    "failed": 1,
    "total": 20
  }
}
```

### Get Email Queue Status

**Endpoint**: `GET /api/email/queue/status`

**Authentication**: Required (admin role)

**Example Response**:
```json
{
  "status": "success",
  "data": {
    "pending": 15,
    "retrying": 2,
    "sent": 340,
    "failed": 3,
    "total": 360
  }
}
```

### Get Queued Emails

**Endpoint**: `GET /api/email/queue`

**Authentication**: Required (admin role)

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status (pending, sent, failed, retrying) |
| limit | number | Items per page (default: 20) |
| page | number | Page number (default: 1) |

**Example Response**:
```json
{
  "status": "success",
  "data": [
    {
      "_id": "60d6c104c1f2d4a8e8a1b2c6",
      "to": "user@example.com",
      "subject": "Task Assigned: Design Homepage",
      "template": "TASK_ASSIGNED",
      "status": "pending",
      "retryCount": 0,
      "maxRetries": 3,
      "createdAt": "2024-01-15T10:25:00.000Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

### Retry Failed Email

**Endpoint**: `POST /api/email/retry/:emailId`

**Authentication**: Required (admin role)

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| emailId | string | Email ID |

**Example Request**:
```bash
curl -X POST "http://localhost:3000/api/email/retry/60d6c104c1f2d4a8e8a1b2c6" \
  -H "Authorization: Bearer your_token"
```

**Example Response**:
```json
{
  "status": "success",
  "message": "Email marked for retry",
  "data": {
    "_id": "60d6c104c1f2d4a8e8a1b2c6",
    "to": "user@example.com",
    "subject": "Task Assigned: Design Homepage",
    "status": "pending",
    "retryCount": 0
  }
}
```

### Send Test Email

**Endpoint**: `POST /api/email/test`

**Authentication**: Required (admin role)

**Request Body**:
```json
{
  "to": "recipient@example.com",
  "subject": "Test Email"
}
```

**Example Request**:
```bash
curl -X POST "http://localhost:3000/api/email/test" \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Test Email"
  }'
```

**Example Response**:
```json
{
  "status": "success",
  "message": "Test email sent successfully",
  "data": {
    "response": "250 Message accepted"
  }
}
```

## Rate Limiting

Currently not implemented. Consider adding rate limiting for production:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Pagination

All list endpoints support pagination:

```
GET /api/activity?page=2&limit=50
```

**Response includes pagination metadata**:
```json
{
  "pagination": {
    "total": 250,
    "page": 2,
    "limit": 50,
    "pages": 5
  }
}
```

**Pagination Rules**:
- Minimum page: 1
- Maximum limit: 100
- Default limit: 20

## Filtering

### Date Range Filtering

```
GET /api/activity?startDate=2024-01-01&endDate=2024-12-31
```

Dates must be in ISO format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ss`

### Multiple Filters

Combine multiple filters:

```
GET /api/activity?projectId=xxx&userId=yyy&action=TASK_ASSIGNED&startDate=2024-01-01&page=1&limit=20
```

## Sorting

Results are automatically sorted by most recent (`createdAt: -1`).

## Response Format

All successful responses follow this format:

```json
{
  "status": "success",
  "data": { ... },
  "pagination": { ... }
}
```

## Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

## Rate Limit Headers

(When rate limiting is implemented)

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

## Webhooks

(Future enhancement)

Currently not supported. Can be added to notify external systems of important events.

## API Versioning

Current API version: v1

Future versions can be prefixed: `/api/v2/...`
