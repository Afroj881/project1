# Task Management API

Enterprise-style Task Management API built with Node.js, Express.js, MongoDB, and Mongoose. It includes authentication, role-based authorization, task CRUD, comments, subtasks, activity logs, audit metadata, attachments from comment payloads, and time tracking.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- Joi request validation
- Morgan logging
- Helmet and CORS security middleware

## Project Structure

```text
config/
  db.js
  index.js
src/
  controllers/
  middleware/
  models/
  routes/
  services/
  utils/
server.js
```

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file from `.env.example`:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/task_management_api
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=2d
```

Start the API:

```bash
npm start
```

For development:

```bash
npm run dev
```

Health check:

```http
GET /api/health
```

## Authentication

All task routes require a bearer token.

```http
Authorization: Bearer <token>
```

### Register

```http
POST /api/auth/register
```

```json
{
  "name": "Project Manager",
  "email": "manager@example.com",
  "password": "password123",
  "role": "project_manager"
}
```

Allowed roles:

- `admin`
- `project_manager`
- `member`

### Login

```http
POST /api/auth/login
```

```json
{
  "email": "manager@example.com",
  "password": "password123"
}
```

## Task Endpoints

Base URL:

```http
/api/tasks
```

### Create Task

```http
POST /api/tasks
```

Allowed roles: `admin`, `project_manager`

```json
{
  "title": "Build task API",
  "description": "Create task management endpoints",
  "project_id": "665f1f77c13a4a0012b90c11",
  "milestone_id": "665f1f77c13a4a0012b90c12",
  "assignee_id": "665f1f77c13a4a0012b90c13",
  "priority": "high",
  "dueDate": "2026-07-01",
  "estimatedHours": 12,
  "tags": ["api", "backend"]
}
```

### List Tasks

```http
GET /api/tasks
```

Supports pagination and filtering:

```http
GET /api/tasks?page=1&limit=20&project=<projectId>&assignee=<userId>&status=in_progress&priority=high&dueDate=2026-07-01
```

Also supports date ranges:

```http
GET /api/tasks?dueDateFrom=2026-07-01&dueDateTo=2026-07-31
```

Filters:

- `project`
- `assignee`
- `status`
- `priority`
- `dueDate`
- `dueDateFrom`
- `dueDateTo`
- `page`
- `limit`

Members only see tasks assigned to them or created by them. Admins and project managers can see all matching tasks.

### Get Task Details

```http
GET /api/tasks/:id
```

Returns complete task information, including:

- Project
- Milestone
- Assignee
- Comments and discussion threads
- Subtasks
- Attachments
- Activity history
- Time logs
- Creator and updater details

### Update Task

```http
PUT /api/tasks/:id
```

```json
{
  "title": "Build complete task API",
  "description": "Update task endpoint coverage",
  "priority": "critical",
  "status": "in_progress",
  "dueDate": "2026-07-05",
  "estimatedHours": 16
}
```

If `status` changes through this endpoint, an activity log entry is created with the previous status, new status, changed fields, user, IP address, and timestamp.

### Change Task Status

```http
PUT /api/tasks/:id/status
```

Allowed roles: `admin`, `project_manager`, `member`

```json
{
  "status": "completed"
}
```

Creates an activity log entry containing:

- User who changed the status
- Previous status
- New status
- Timestamp
- IP address
- Change metadata

### Add Comment

```http
POST /api/tasks/:id/comments
```

```json
{
  "body": "This is ready for review.",
  "parentComment": null,
  "attachments": [
    {
      "filename": "requirements.pdf",
      "url": "https://example.com/files/requirements.pdf"
    }
  ]
}
```

Use `parentComment` to create a discussion thread.

### Create Subtask

```http
POST /api/tasks/:id/subtasks
```

Allowed roles: `admin`, `project_manager`

```json
{
  "title": "Write validation rules",
  "description": "Add Joi schemas",
  "assignee_id": "665f1f77c13a4a0012b90c13",
  "priority": "medium",
  "dueDate": "2026-06-25",
  "estimatedHours": 4
}
```

Subtasks are stored as tasks linked to the parent task with `parentTask`.

### Record Time Log

```http
PUT /api/tasks/:id/time-log
```

Allowed roles: `admin`, `project_manager`, `member`

```json
{
  "hours": 2.5,
  "note": "Implemented status audit logging",
  "entryDate": "2026-06-13"
}
```

This endpoint:

- Creates a time log entry
- Updates the task's `actualHours`
- Adds activity history for the time entry

## Task Status Values

- `backlog`
- `in_progress`
- `review`
- `blocked`
- `completed`
- `cancelled`

## Priority Values

- `low`
- `medium`
- `high`
- `critical`

## Error Format

Typical error response:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["\"title\" is required"]
}
```

## Notes

- MongoDB must be running before starting the server.
- Project, milestone, and user records must exist before assigning them to tasks.
- Milestones must belong to the selected project.
- Task route access is restricted by JWT authentication and role checks.
