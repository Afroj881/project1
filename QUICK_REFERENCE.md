# Quick Reference

## File Structure

```
project-root/
├── src/
│   ├── config/           # Database & Email config
│   ├── models/           # MongoDB schemas (7 models)
│   ├── controllers/      # Request handlers (2 controllers)
│   ├── services/         # Business logic (2 services)
│   ├── routes/           # API routes (2 route files)
│   ├── middleware/       # Auth, validation, error handlers
│   ├── templates/        # Email templates (7 templates)
│   ├── utils/            # Helpers & utilities
│   └── cron/             # Scheduled tasks
├── logs/                 # Application logs
├── .env.example          # Environment template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies
├── server.js             # Main entry point
├── README.md             # Main documentation
├── API.md                # API reference
├── IMPLEMENTATION_GUIDE.md # Implementation examples
└── CONFIGURATION.md      # Configuration guide
```

## Key Features Implemented

✓ Nodemailer with Gmail SMTP
✓ 7 Email notification templates
✓ Activity Log model with full tracking
✓ Email queue with retry logic
✓ Daily deadline reminders (cron)
✓ Comprehensive API (12 endpoints)
✓ Pagination & filtering
✓ Authentication middleware
✓ Role-based authorization
✓ Input validation
✓ Error handling
✓ PDF generation support
✓ Logging system
✓ Security features

## Quick Commands

### Start
```bash
npm install
npm run dev
```

### Test Email
```bash
curl -X POST http://localhost:3000/api/email/test \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"to":"email@example.com","subject":"Test"}'
```

### Get Activity Logs
```bash
curl -X GET "http://localhost:3000/api/activity?limit=20" \
  -H "Authorization: Bearer token"
```

### Check Email Queue
```bash
curl -X GET http://localhost:3000/api/email/queue/status \
  -H "Authorization: Bearer token"
```

## Environment Variables

Essential variables needed in `.env`:
- MONGODB_URI
- GMAIL_EMAIL & GMAIL_PASSWORD
- JWT_SECRET
- APP_URL & FRONTEND_URL
- NODE_ENV

See CONFIGURATION.md for complete setup.

## Models Created

1. **ActivityLog** - Tracks all system activities
2. **EmailQueue** - Manages email delivery queue
3. **User** - User information
4. **Project** - Project management
5. **Task** - Task details
6. **Invoice** - Invoice tracking
7. **TeamInvitation** - Team invitations

## API Endpoints

### Activity Endpoints
- `GET /api/activity` - Get all activities
- `GET /api/activity/summary` - Activity summary
- `GET /api/activity/user/:userId` - User activities
- `GET /api/activity/project/:projectId` - Project activities
- `GET /api/activity/entity/:entity/:entityId` - Entity activities

### Email Endpoints
- `POST /api/email/process-queue` - Process pending emails
- `GET /api/email/queue/status` - Queue status
- `GET /api/email/queue` - List queued emails
- `POST /api/email/retry/:emailId` - Retry failed email
- `POST /api/email/test` - Send test email

## Email Templates

1. **taskAssigned** - Task assignment notification
2. **deadlineReminder** - Project deadline reminder
3. **invoiceDelivery** - Invoice with PDF
4. **invoiceOverdue** - Overdue invoice reminder
5. **teamInvitation** - Team join invitation
6. **passwordReset** - Password reset with OTP
7. **commentNotification** - New comment notification

## Services

### ActivityService
- logActivity()
- getActivityLogs()
- getUserActivity()
- getProjectActivity()
- getEntityActivity()
- Specialized loggers for each action type

### EmailService
- sendEmail()
- queueEmail()
- sendOrQueueEmail()
- processEmailQueue()
- Specialized senders for each template

## Middleware

- `verifyToken` - JWT authentication
- `isAuthenticated` - Check user is logged in
- `hasRole` - Check user has required role
- `captureMetadata` - Capture IP & user agent
- `validatePagination` - Validate page/limit
- `validateActivityFilters` - Validate filter params
- `globalErrorHandler` - Centralized error handling
- `notFoundHandler` - 404 handler

## Configuration Options

Key environment variables:
```env
# Cron schedule (default: 0 9 * * *)
CRON_DEADLINE_REMINDER_SCHEDULE

# Email queue (default: true)
ENABLE_EMAIL_QUEUE

# Retries (default: 3)
EMAIL_RETRY_LIMIT

# Logging level (default: info)
LOG_LEVEL
```

## Next Steps for Integration

1. Update authentication (implement real JWT)
2. Connect to existing User model
3. Integrate with existing Project/Task models
4. Add more email templates as needed
5. Setup monitoring/alerting
6. Implement rate limiting
7. Add database backups
8. Setup CI/CD pipeline

## Performance Tips

- Use pagination for large queries
- Process email queue regularly
- Archive old activity logs (90+ days)
- Monitor cron job execution
- Use database indexes effectively
- Enable email queue for reliability

## Security Checklist

- ✓ Input validation
- ✓ Authentication middleware
- ✓ Role-based authorization
- ✓ Error handling
- ✓ Audit logging
- [ ] HTTPS (add in production)
- [ ] Rate limiting (add in production)
- [ ] Secret rotation (implement in production)
- [ ] Encryption at rest (add in production)

## Support & Documentation

- README.md - Project overview & setup
- API.md - Complete API documentation
- IMPLEMENTATION_GUIDE.md - Code examples
- CONFIGURATION.md - Configuration details
