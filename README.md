# Team Management API

A Node.js, Express, and MongoDB API module for enterprise team management with invitation workflows, role-based access control, workload analytics, and task management.

## Features

- `GET /api/team` - Retrieve all team members (Admin and Manager only)
- `POST /api/team/invite` - Send email invitations with secure invitation tokens
- `POST /api/team/accept-invite` - Accept invitation, set password, complete profile, and activate account
- `PUT /api/team/:id/role` - Update a member's role (Admin only)
- `PUT /api/team/:id/status` - Activate or deactivate a member
- `GET /api/team/:id/tasks` - Fetch all tasks assigned to a team member
- `GET /api/team/workload` - Generate workload overview with pending, overdue, and distribution metrics
- Authentication and role-based authorization
- Activity logging and centralized error handling
- Pagination support for team member and task listings

## Getting Started

### Prerequisites

- Node.js 18+ or newer
- MongoDB running locally or remotely
- SMTP credentials for email delivery

### Installation

1. Clone the repository or copy files into your workspace.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root using `.env.example`:

```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and email service credentials.

### Environment Variables

Required variables:

- `PORT` - Server port (default: 4000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for signing auth tokens
- `JWT_EXPIRES_IN` - auth token expiration (example: `1d`)
- `INVITE_TOKEN_EXPIRES_IN` - invitation token expiration in days
- `EMAIL_HOST` - SMTP hostname
- `EMAIL_PORT` - SMTP port
- `EMAIL_SECURE` - `true` or `false`
- `EMAIL_USER` - SMTP username
- `EMAIL_PASS` - SMTP password
- `EMAIL_FROM` - sender address for invitation emails
- `APP_BASE_URL` - base URL used for invitation links

### Running the Server

```bash
npm run dev
```

Then visit `http://localhost:4000` to confirm the API is running.

## API Endpoints

### Authentication

- `POST /api/auth/login`
  - body: `{ "email": "user@example.com", "password": "password" }`

### Team Management

- `GET /api/team`
  - Roles: `Admin`, `Manager`
  - Query params: `page`, `limit`

- `POST /api/team/invite`
  - Roles: `Admin`, `Manager`
  - body: `{ "email": "invitee@example.com", "role": "Developer" }`

- `POST /api/team/accept-invite`
  - body: `{ "token": "...", "password": "secret", "name": "Jane Doe", "profile": { "title": "Engineer" } }`

- `PUT /api/team/:id/role`
  - Roles: `Admin`
  - body: `{ "role": "Manager" }`

- `PUT /api/team/:id/status`
  - Roles: `Admin`
  - body: `{ "status": "Active" }`

- `GET /api/team/:id/tasks`
  - Roles: authenticated users
  - Query params: `page`, `limit`

- `GET /api/team/workload`
  - Roles: `Admin`, `Manager`

## Data Models

### User

- `email`
- `name`
- `role`
- `password`
- `status`
- `profile`
- `invitationToken`
- `invitationTokenExpiresAt`

### Task

- `title`
- `description`
- `status`
- `priority`
- `deadline`
- `project`
- `assignee`
- `isActive`

## Notes

- This module stores user records and does not delete them on status changes.
- Invitation tokens are single-use and expire automatically.
- Role-based access controls are enforced through middleware.

## License

MIT
