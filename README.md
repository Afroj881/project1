# Invoice APIs

Enterprise-grade invoice API scaffold with automatic invoice number generation, item-level calculations, status workflows, PDF generation, email delivery, and role-based authorization.

## Features

- `POST /api/invoices` to create a new invoice
- `GET /api/invoices` to retrieve paginated invoices with filtering and search
- `GET /api/invoices/:id` to fetch invoice details with client/project info
- `PUT /api/invoices/:id` to update invoices in `draft` status only
- `PUT /api/invoices/:id/send` to send invoice documents and email the client
- `PUT /api/invoices/:id/mark-paid` to record payment and set `paidAt`
- `GET /api/invoices/overdue` to retrieve overdue invoices
- Automatic subtotal, GST, discount, and total calculation
- Authentication and role-based authorization
- Audit logging for invoice events
- PDF generation and email attachment support

## Getting Started

### Requirements

- Node.js 18+ or compatible
- npm

### Install Dependencies

```bash
cd "C:\Users\afroj\Documents\Invoice APIs"
npm install
```

### Run the API

```bash
npm start
```

The server listens on `http://localhost:4000` by default.

## Authentication

This project includes a simple JWT-based auth middleware for development convenience. Use an Authorization header with a Bearer token.

Example users are seeded in `src/middleware/authMiddleware.js`:

- `admin@example.com` (role: `admin`)
- `accountant@example.com` (role: `accountant`)
- `viewer@example.com` (role: `viewer`)

For development, you can generate tokens using the `generateTestToken` helper from `src/middleware/authMiddleware.js`.

## API Endpoints

### Create Invoice

`POST /api/invoices`

Body:

```json
{
  "client_id": "client-1",
  "project_id": "project-1",
  "items": [
    { "description": "Design", "quantity": 2, "rate": 200, "gstPercentage": 18 },
    { "description": "Development", "quantity": 5, "rate": 100, "gstPercentage": 18 }
  ],
  "discount": 50,
  "dueDate": "2026-07-14",
  "notes": "Thank you for your business."
}
```

### List Invoices

`GET /api/invoices`

Query parameters:

- `page`
- `pageSize`
- `status`
- `client_id`
- `project_id`
- `fromDate`
- `toDate`
- `search`

### Get Invoice Details

`GET /api/invoices/:id`

### Update Invoice

`PUT /api/invoices/:id`

Only allowed when invoice status is `draft`.

### Send Invoice

`PUT /api/invoices/:id/send`

Changes invoice status to `sent`, generates a PDF, and emails it to the client.

### Mark Invoice Paid

`PUT /api/invoices/:id/mark-paid`

Records payment and updates `paidAt`.

### Overdue Invoices

`GET /api/invoices/overdue`

Retrieves invoices that are unpaid and past the due date.

## Architecture

- `src/server.js` - Express app entrypoint
- `src/routes/` - API route definitions
- `src/controllers/` - Request handlers
- `src/services/` - Business logic
- `src/models/` - In-memory data models
- `src/middleware/` - Auth, validation, and error handling
- `src/utils/` - Invoice calculations, PDF generation, and email helper

## Notes

- This project uses in-memory storage for invoices, clients, and projects. For production, connect to a database and replace the temporary data stores.
- Email sending currently uses `nodemailer` with `jsonTransport` for local testing. Replace with a real SMTP or email service provider in production.
- Invoice numbers follow the pattern `INV-<year>-<sequence>`.

## License

MIT
