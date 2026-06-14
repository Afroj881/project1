# Email Notification and Activity Log System

A comprehensive, enterprise-grade email notification and activity logging system built with Node.js, Express, MongoDB, and Nodemailer.

## Features

### 📧 Email Notifications
- **Task Assignments**: Notify team members when tasks are assigned
- **Deadline Reminders**: Send automated reminders 2 days before project deadlines
- **Invoice Delivery**: Send invoices with PDF attachments
- **Invoice Overdue Reminders**: Alert about overdue invoices
- **Team Invitations**: Secure team invitation emails with unique tokens
- **Password Reset**: OTP and reset link emails
- **Comment Notifications**: Notify users of new comments on their tasks

### 📊 Activity Logging
- **Comprehensive Activity Tracking**: Logs all important system events
- **Flexible Filtering**: Filter by user, action, entity type, project, and date range
- **Pagination Support**: Efficient data retrieval with pagination
- **Detailed Metadata**: Capture IP addresses, user agents, and changes

### ⏰ Scheduled Tasks
- **Cron Job Support**: Daily deadline reminders using node-cron
- **Email Queue**: Queue emails for reliable delivery with retry logic

### 🔐 Security & Authorization
- **Authentication Middleware**: Token verification
- **Role-Based Access Control**: Manage permissions by role
- **Input Validation**: Comprehensive validation for all inputs
- **Error Handling**: Centralized error handling

## Project Structure

```
src/
├── config/           # Configuration files
│   ├── database.js   # MongoDB connection
│   └── nodemailer.js # Email transporter setup
├── models/           # MongoDB schemas
│   ├── ActivityLog.js
│   ├── EmailQueue.js
│   ├── User.js
│   ├── Project.js
│   ├── Task.js
│   ├── Invoice.js
│   └── TeamInvitation.js
├── controllers/      # Request handlers
│   ├── activityController.js
│   └── emailController.js
├── services/         # Business logic
│   ├── activityService.js
│   └── emailService.js
├── routes/           # API routes
│   ├── activityRoutes.js
│   └── emailRoutes.js
├── middleware/       # Express middleware
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
├── templates/        # Email templates
│   ├── taskAssigned.js
│   ├── deadlineReminder.js
│   ├── invoiceDelivery.js
│   ├── invoiceOverdue.js
│   ├── teamInvitation.js
│   ├── passwordReset.js
│   └── commentNotification.js
├── utils/            # Utility functions
│   ├── logger.js
│   ├── errorHandler.js
│   ├── tokenGenerator.js
│   ├── validators.js
│   └── pdfGenerator.js
└── cron/             # Scheduled jobs
    └── deadlineReminder.js
```

## Installation

### Prerequisites
- Node.js 14+
- MongoDB 4+
- Gmail account with App Password

### Setup Steps

1. **Clone and Install**
```bash
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/email-notification-db

# Gmail SMTP (Generate App Password in Gmail settings)
GMAIL_EMAIL=your-email@gmail.com
GMAIL_PASSWORD=your-app-specific-password

# Email Configuration
EMAIL_FROM_NAME=Project Management System
EMAIL_FROM_EMAIL=your-email@gmail.com

# Application URLs
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001

# Cron Job
CRON_DEADLINE_REMINDER_SCHEDULE=0 9 * * *
ENABLE_CRON_JOBS=true

# Email Queue
ENABLE_EMAIL_QUEUE=true
EMAIL_QUEUE_BATCH_SIZE=10
EMAIL_QUEUE_PROCESS_INTERVAL=5000
```

3. **Start MongoDB**
```bash
mongod
```

4. **Start the Server**
```bash
npm run dev
```

## API Endpoints

### Activity Log Endpoints

#### Get Activity Logs
```
GET /api/activity?page=1&limit=20&action=TASK_ASSIGNED&entity=TASK&projectId=xxx&startDate=2024-01-01&endDate=2024-12-31
```

Query Parameters:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `action` (string): Filter by action type
- `entity` (string): Filter by entity type (PROJECT, TASK, COMMENT, FILE, INVOICE, TEAM, USER)
- `projectId` (string): Filter by project
- `startDate` (date): Filter from date
- `endDate` (date): Filter to date

Response:
```json
{
  "status": "success",
  "data": [
    {
      "_id": "...",
      "userId": "...",
      "action": "TASK_ASSIGNED",
      "entity": "TASK",
      "entityId": "...",
      "description": "Task 'Design Homepage' assigned",
      "projectId": "...",
      "createdAt": "2024-01-15T10:30:00Z",
      "user": {
        "_id": "...",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

#### Get User Activity
```
GET /api/activity/user/:userId?page=1&limit=20
```

#### Get Project Activity
```
GET /api/activity/project/:projectId?page=1&limit=20
```

#### Get Entity Activity
```
GET /api/activity/entity/:entity/:entityId?page=1&limit=20
```

#### Get Activity Summary
```
GET /api/activity/summary?projectId=xxx&userId=xxx&days=30
```

### Email Management Endpoints

#### Process Email Queue
```
POST /api/email/process-queue?limit=10
```

Response:
```json
{
  "status": "success",
  "data": {
    "processed": 8,
    "failed": 1,
    "total": 10
  }
}
```

#### Get Queue Status
```
GET /api/email/queue/status
```

Response:
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

#### Get Queued Emails
```
GET /api/email/queue?status=pending&limit=20&page=1
```

#### Retry Failed Email
```
POST /api/email/retry/:emailId
```

#### Send Test Email
```
POST /api/email/test
Content-Type: application/json

{
  "to": "recipient@example.com",
  "subject": "Test Email"
}
```

## Usage Examples

### Log Activity Programmatically

```javascript
const ActivityService = require('./src/services/activityService');

// Log task assignment
await ActivityService.logTaskAssigned(
  userId,
  taskId,
  'Design Homepage',
  projectId,
  assignedToUserId,
  ipAddress,
  userAgent
);

// Log project creation
await ActivityService.logProjectCreated(
  userId,
  projectId,
  'Q1 Marketing Campaign',
  ipAddress,
  userAgent
);
```

### Send Emails Programmatically

```javascript
const EmailService = require('./src/services/emailService');

// Send task assigned email
await EmailService.sendTaskAssignedEmail({
  recipientName: 'John Doe',
  recipientEmail: 'john@example.com',
  taskTitle: 'Design Homepage',
  projectName: 'Website Redesign',
  assignedBy: 'Jane Smith',
  taskDescription: 'Create a modern homepage design',
  taskUrl: 'http://localhost:3000/tasks/123',
  taskDeadline: '2024-02-15',
  userId: assignedByUserId
});

// Send invoice delivery email with PDF
const pdfBuffer = await generateInvoicePDF(invoiceData);
await EmailService.sendInvoiceDeliveryEmail({
  recipientName: 'Client Name',
  recipientEmail: 'client@example.com',
  invoiceNumber: 'INV-202401-ABC123',
  clientName: 'Acme Corp',
  amount: 5000,
  currency: 'USD',
  dueDate: '2024-02-15',
  invoiceUrl: 'http://localhost:3000/invoices/123',
  projectName: 'Website Development',
  userId: userId
}, pdfBuffer);

// Send team invitation
await EmailService.sendTeamInvitationEmail({
  recipientName: 'New Team Member',
  recipientEmail: 'newmember@example.com',
  projectName: 'Q1 Marketing Campaign',
  invitedBy: 'Jane Smith',
  role: 'Team Member',
  inviteUrl: 'http://localhost:3000/invite/abc123token',
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  userId: invitedByUserId
});
```

## Activity Log Actions

The system tracks the following actions:

```
PROJECT_CREATED
PROJECT_UPDATED
PROJECT_DELETED
TASK_CREATED
TASK_UPDATED
TASK_STATUS_CHANGED
TASK_ASSIGNED
TASK_DELETED
COMMENT_ADDED
COMMENT_UPDATED
COMMENT_DELETED
FILE_UPLOADED
FILE_DELETED
INVOICE_GENERATED
INVOICE_PAID
INVOICE_SENT
TEAM_INVITATION_SENT
TEAM_MEMBER_ADDED
TEAM_MEMBER_REMOVED
ROLE_UPDATED
CLIENT_CREATED
CLIENT_UPDATED
CLIENT_DELETED
PASSWORD_RESET
LOGIN
LOGOUT
```

## Email Queue Management

The system includes an email queue for reliable delivery:

1. **Queueing**: Emails are queued when `ENABLE_EMAIL_QUEUE=true`
2. **Processing**: Queue is processed periodically (configurable interval)
3. **Retries**: Failed emails are retried up to `EMAIL_RETRY_LIMIT` times
4. **Monitoring**: Check queue status via API endpoints

### Enable Email Queue Processing

Create a cron job or interval to process the queue:

```javascript
const EmailService = require('./src/services/emailService');

// Process queue every 5 minutes
setInterval(async () => {
  try {
    const result = await EmailService.processEmailQueue(10);
    console.log('Queue processed:', result);
  } catch (error) {
    console.error('Error processing queue:', error);
  }
}, 5 * 60 * 1000);
```

## Cron Jobs

### Deadline Reminder (Daily)

Configured to run at 9 AM by default (set via `CRON_DEADLINE_REMINDER_SCHEDULE`):

```
0 9 * * * - Runs every day at 9:00 AM
```

To change the schedule, use cron syntax:
```env
CRON_DEADLINE_REMINDER_SCHEDULE=0 18 * * 1-5  # 6 PM on weekdays
```

## Best Practices

### Email Sending
- Use `ENABLE_EMAIL_QUEUE=true` for production
- Set appropriate retry limits and delays
- Monitor the email queue regularly
- Test with `POST /api/email/test` before deployment

### Activity Logging
- Always include `ipAddress` and `userAgent` for audit trails
- Use consistent action names
- Include descriptive messages
- Log important events only (avoid logging every minor change)

### Security
- Regenerate JWT secrets in production
- Use environment variables for sensitive data
- Implement role-based access control
- Validate all user inputs
- Use HTTPS in production

### Performance
- Use pagination for large datasets
- Index frequently filtered fields
- Clean up old activity logs periodically
- Process email queue in batches

## Troubleshooting

### Emails Not Sending

1. Check Gmail App Password is correct
2. Verify SMTP credentials in `.env`
3. Check email queue status: `GET /api/email/queue/status`
4. Review logs for error messages
5. Test connection: `POST /api/email/test`

### Activity Logs Not Appearing

1. Verify MongoDB connection
2. Check user authentication
3. Confirm activity is being logged (call service methods)
4. Review activity logs via API

### Cron Jobs Not Running

1. Verify `ENABLE_CRON_JOBS=true`
2. Check cron schedule syntax
3. Review server logs
4. Verify MongoDB connection

## Development

### Run Tests
```bash
npm test
```

### Start Development Server
```bash
npm run dev
```

### View Logs
```bash
tail -f logs/app.log
```

## Dependencies

- `express`: Web framework
- `mongoose`: MongoDB ODM
- `nodemailer`: Email sending
- `node-cron`: Scheduled tasks
- `joi`: Input validation
- `uuid`: Unique identifiers
- `pdfkit`: PDF generation
- `dotenv`: Environment configuration

## License

MIT

## Support

For issues and questions, please contact the development team.
