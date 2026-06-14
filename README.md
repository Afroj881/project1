# File Upload + Notification API

Enterprise-grade Node.js API for secure file uploads, Cloudinary storage, and notification handling in a project management platform.

## Features

- Secure JWT authentication and role-based authorization
- Multer file upload handling
- Cloudinary file storage and deletion
- File metadata saved in MongoDB
- Attach files to projects, tasks, milestones, comments, and other entities
- Notifications for events such as task assignment, status updates, milestones, invoices, comments, file uploads, and team invitations
- Pagination and unread count support for notifications
- Clean layered architecture with routes, controllers, services, models, and middleware

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on `.env.example`.

3. Start the application:

```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### Files
- `POST /api/upload`
- `GET /api/files/project/:id`
- `DELETE /api/files/:id`

### Notifications
- `POST /api/notifications`
- `GET /api/notifications/my`
- `PUT /api/notifications/read-all`
- `GET /api/notifications/unread-count`

## Environment Variables

Example variables are provided in `.env.example`.

## Notes

- The application uses MongoDB via Mongoose.
- File uploads use multipart form data with `file` field.
- Authorization is required for protected routes.
