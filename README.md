# Client Portal API

This module provides a secure client-facing API with role-based access control. Endpoints are under `/api/client-portal` and require JWT authentication for users with the `client` role.

Quick start:

1. Copy `.env.example` to `.env` and set values.
2. Install dependencies: `npm install`
3. Start: `npm run dev` or `npm start`

Endpoints implemented:
- `GET /api/client-portal/dashboard`
- `GET /api/client-portal/projects`
- `GET /api/client-portal/projects/:id`
- `GET /api/client-portal/invoices`
- `POST /api/client-portal/feedback`

Files are organized into `models`, `routes`, `controllers`, `services`, `middleware`, and `utils` for scalability.
