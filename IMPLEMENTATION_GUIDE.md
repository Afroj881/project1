# Implementation Guide

## Quick Start

### 1. Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Configure .env with your values
# - MongoDB connection string
# - Gmail credentials
# - App URLs
```

### 2. Start Server

```bash
# Development
npm run dev

# Production
npm start
```

### 3. Verify Installation

```bash
# Check health
curl http://localhost:3000/health

# Should return:
# {"status":"ok","timestamp":"...","environment":"development"}
```

## Integration Examples

### Example 1: Task Assignment Flow

```javascript
// 1. Task is created and assigned
const task = await Task.create({
  title: 'Design Homepage',
  projectId: projectId,
  assignedTo: userId,
  createdBy: currentUserId,
  deadline: '2024-02-15'
});

// 2. Log the activity
await ActivityService.logTaskAssigned(
  currentUserId,
  task._id,
  task.title,
  projectId,
  userId,
  req.ip,
  req.headers['user-agent']
);

// 3. Send notification email
const user = await User.findById(userId);
const project = await Project.findById(projectId);

await EmailService.sendTaskAssignedEmail({
  recipientName: user.name,
  recipientEmail: user.email,
  taskTitle: task.title,
  projectName: project.name,
  assignedBy: req.user.name,
  taskDescription: task.description,
  taskUrl: `${process.env.APP_URL}/tasks/${task._id}`,
  taskDeadline: task.deadline,
  userId: userId
});
```

### Example 2: Invoice Generation and Delivery

```javascript
// 1. Generate invoice
const invoice = await Invoice.create({
  invoiceNumber: generateInvoiceNumber(),
  clientId: clientId,
  projectId: projectId,
  amount: totalAmount,
  currency: 'USD',
  issueDate: new Date(),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  items: invoiceItems,
  status: 'draft'
});

// 2. Log activity
await ActivityService.logInvoiceGenerated(
  currentUserId,
  invoice._id,
  invoice.invoiceNumber,
  projectId,
  req.ip,
  req.headers['user-agent']
);

// 3. Generate PDF
const pdfBuffer = await generateInvoicePDF({
  invoiceNumber: invoice.invoiceNumber,
  clientName: client.name,
  clientEmail: client.email,
  items: invoice.items,
  amount: invoice.amount,
  currency: invoice.currency,
  issueDate: invoice.issueDate,
  dueDate: invoice.dueDate,
  notes: invoice.notes
});

// 4. Send invoice email with PDF
const client = await User.findById(clientId);
await EmailService.sendInvoiceDeliveryEmail({
  recipientName: client.name,
  recipientEmail: client.email,
  invoiceNumber: invoice.invoiceNumber,
  clientName: client.name,
  amount: invoice.amount,
  currency: invoice.currency,
  dueDate: invoice.dueDate,
  invoiceUrl: `${process.env.APP_URL}/invoices/${invoice._id}`,
  projectName: project.name,
  userId: currentUserId
}, pdfBuffer);

// 5. Update invoice status
invoice.status = 'sent';
await invoice.save();
```

### Example 3: Comment Notification

```javascript
// 1. Add comment to task
const comment = await Comment.create({
  text: 'This looks great! Please review...',
  taskId: taskId,
  authorId: currentUserId,
  createdAt: new Date()
});

// 2. Log activity
await ActivityService.logCommentAdded(
  currentUserId,
  comment._id,
  taskId,
  projectId,
  task.title,
  req.ip,
  req.headers['user-agent']
);

// 3. Notify task assignee
if (task.assignedTo && task.assignedTo !== currentUserId) {
  const assignee = await User.findById(task.assignedTo);
  const author = await User.findById(currentUserId);

  await EmailService.sendCommentNotificationEmail({
    recipientName: assignee.name,
    recipientEmail: assignee.email,
    taskTitle: task.title,
    projectName: project.name,
    commentAuthor: author.name,
    commentText: comment.text,
    taskUrl: `${process.env.APP_URL}/tasks/${taskId}`,
    userId: currentUserId
  });
}
```

### Example 4: Team Invitation

```javascript
// 1. Generate secure invite token
const { token: inviteToken } = generateInvitationToken();
const inviteExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

// 2. Create team invitation record
const invitation = await TeamInvitation.create({
  email: inviteeEmail,
  projectId: projectId,
  invitedBy: currentUserId,
  token: inviteToken,
  role: 'team_member',
  expiresAt: inviteExpiry,
  status: 'pending'
});

// 3. Log activity
await ActivityService.logTeamInvitationSent(
  currentUserId,
  invitation._id,
  projectId,
  inviteeEmail,
  req.ip,
  req.headers['user-agent']
);

// 4. Send invitation email
const inviter = await User.findById(currentUserId);
await EmailService.sendTeamInvitationEmail({
  recipientEmail: inviteeEmail,
  recipientName: inviteeEmail.split('@')[0],
  projectName: project.name,
  invitedBy: inviter.name,
  role: 'team_member',
  inviteUrl: `${process.env.FRONTEND_URL}/invite/${inviteToken}`,
  expiresAt: inviteExpiry,
  userId: currentUserId
});
```

### Example 5: Password Reset Flow

```javascript
// 1. User requests password reset
const { token, hash, expires } = generateResetToken();
const otp = generateOTP(6);

// 2. Store reset token
const user = await User.findById(userId);
user.passwordResetToken = hash;
user.passwordResetExpires = expires;
await user.save();

// 3. Log activity
await ActivityService.logPasswordReset(
  userId,
  req.ip,
  req.headers['user-agent']
);

// 4. Send reset email
await EmailService.sendPasswordResetEmail({
  recipientName: user.name,
  recipientEmail: user.email,
  resetLink: `${process.env.FRONTEND_URL}/reset-password/${token}`,
  expiresAt: expires,
  otp: otp,
  userId: userId
});

// 5. User validates token and resets password
const resetUser = await User.findOne({
  passwordResetToken: hashToken(token),
  passwordResetExpires: { $gt: new Date() }
});

if (resetUser) {
  resetUser.password = newPassword; // Hash before saving
  resetUser.passwordResetToken = undefined;
  resetUser.passwordResetExpires = undefined;
  await resetUser.save();
}
```

### Example 6: Daily Deadline Reminder

The cron job automatically runs daily:

```javascript
// Runs at 9 AM (configurable)
// Finds projects with deadline in 2 days
// Identifies overdue and due-soon tasks
// Sends reminders to project owner and team members
```

To manually trigger:

```javascript
const { sendDeadlineReminders } = require('./src/cron/deadlineReminder');
await sendDeadlineReminders();
```

## Activity Log Examples

### Log Project Creation

```javascript
await ActivityService.logProjectCreated(
  userId,
  projectId,
  'Q1 Marketing Campaign',
  req.ip,
  req.headers['user-agent']
);
```

### Log Project Update

```javascript
await ActivityService.logProjectUpdated(
  userId,
  projectId,
  'Q1 Marketing Campaign',
  {
    before: { status: 'planning', deadline: '2024-03-31' },
    after: { status: 'active', deadline: '2024-04-30' }
  },
  req.ip,
  req.headers['user-agent']
);
```

### Log Task Status Change

```javascript
await ActivityService.logTaskStatusChanged(
  userId,
  taskId,
  'Design Homepage',
  projectId,
  'pending',
  'in_progress',
  req.ip,
  req.headers['user-agent']
);
```

### Log Invoice Payment

```javascript
await ActivityService.logInvoicePaid(
  userId,
  invoiceId,
  'INV-202401-ABC123',
  projectId,
  '$5000',
  req.ip,
  req.headers['user-agent']
);
```

## Query Examples

### Get All Activity for a Project (Last 7 Days)

```bash
curl -X GET "http://localhost:3000/api/activity" \
  -H "Authorization: Bearer your_token" \
  -G \
  --data-urlencode "projectId=60d6c104c1f2d4a8e8a1b2c3" \
  --data-urlencode "startDate=2024-01-08" \
  --data-urlencode "endDate=2024-01-15" \
  --data-urlencode "limit=50"
```

### Get All Task-Related Activities

```bash
curl -X GET "http://localhost:3000/api/activity" \
  -H "Authorization: Bearer your_token" \
  -G \
  --data-urlencode "entity=TASK" \
  --data-urlencode "action=TASK_ASSIGNED" \
  --data-urlencode "limit=100"
```

### Get Activity Summary for a Project

```bash
curl -X GET "http://localhost:3000/api/activity/summary" \
  -H "Authorization: Bearer your_token" \
  -G \
  --data-urlencode "projectId=60d6c104c1f2d4a8e8a1b2c3" \
  --data-urlencode "days=30"
```

### Monitor Email Queue

```bash
# Check queue status
curl -X GET "http://localhost:3000/api/email/queue/status" \
  -H "Authorization: Bearer admin_token"

# Get pending emails
curl -X GET "http://localhost:3000/api/email/queue?status=pending&limit=50" \
  -H "Authorization: Bearer admin_token"

# Process queue
curl -X POST "http://localhost:3000/api/email/process-queue?limit=20" \
  -H "Authorization: Bearer admin_token"
```

## Configuration Management

### Email Configuration

Edit `.env` to customize email behavior:

```env
# Retry settings
EMAIL_RETRY_LIMIT=3
EMAIL_RETRY_DELAY=5000

# Batch processing
EMAIL_QUEUE_BATCH_SIZE=10
EMAIL_QUEUE_PROCESS_INTERVAL=5000

# Sender information
EMAIL_FROM_NAME=Project Management System
EMAIL_FROM_EMAIL=your-email@gmail.com
```

### Cron Configuration

Edit `.env` to customize cron schedules:

```env
# Daily at 9 AM
CRON_DEADLINE_REMINDER_SCHEDULE=0 9 * * *

# Disable if needed
ENABLE_CRON_JOBS=false
```

### Pagination

Edit `.env` to customize pagination:

```env
PAGINATION_LIMIT=20
PAGINATION_DEFAULT_PAGE=1
```

## Monitoring

### Check Email Queue Health

```javascript
const EmailQueue = require('./src/models/EmailQueue');

const status = await EmailQueue.collection.aggregate([
  {
    $group: {
      _id: '$status',
      count: { $sum: 1 }
    }
  }
]).toArray();

console.log('Email Queue Status:', status);
```

### Check Activity Log Size

```javascript
const ActivityLog = require('./src/models/ActivityLog');

const count = await ActivityLog.countDocuments();
const oldestLog = await ActivityLog.findOne().sort({ createdAt: 1 });
const newestLog = await ActivityLog.findOne().sort({ createdAt: -1 });

console.log(`Total logs: ${count}`);
console.log(`Oldest log: ${oldestLog.createdAt}`);
console.log(`Newest log: ${newestLog.createdAt}`);
```

## Testing

### Test Email Service

```bash
# Send test email
curl -X POST "http://localhost:3000/api/email/test" \
  -H "Authorization: Bearer admin_token" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email from System"
  }'
```

### Test Activity Logging

```javascript
// In Node REPL or test file
const ActivityService = require('./src/services/activityService');

await ActivityService.logActivity({
  userId: 'test-user-id',
  action: 'TEST_ACTION',
  entity: 'TEST',
  entityId: 'test-id',
  description: 'Test activity entry',
  projectId: 'test-project-id',
  ipAddress: '127.0.0.1',
  userAgent: 'Test Agent'
});
```

## Backup and Maintenance

### Backup Activity Logs

```bash
# Export activity logs
mongoexport --db email-notification-db --collection activityLogs --out activityLogs_backup.json

# Export email queue
mongoexport --db email-notification-db --collection emailqueues --out emailQueues_backup.json
```

### Archive Old Activity Logs

```javascript
const ActivityLog = require('./src/models/ActivityLog');

// Archive logs older than 90 days
const cutoffDate = new Date();
cutoffDate.setDate(cutoffDate.getDate() - 90);

const archived = await ActivityLog.deleteMany({
  createdAt: { $lt: cutoffDate }
});

console.log(`Archived ${archived.deletedCount} old logs`);
```

## Performance Optimization

### Add Database Indexes

Indexes are already created in the model, but you can verify:

```javascript
const ActivityLog = require('./src/models/ActivityLog');
const indexes = await ActivityLog.collection.getIndexes();
console.log('Indexes:', indexes);
```

### Monitor Query Performance

```javascript
// Enable MongoDB profiling
db.setProfilingLevel(2);

// View slow queries
db.system.profile.find({ millis: { $gt: 100 } }).pretty();
```

## Troubleshooting

### Email Not Sent

1. Check MongoDB connection
2. Verify Gmail credentials
3. Check email queue: `GET /api/email/queue/status`
4. Review application logs: `tail -f logs/app.log`
5. Test connection: `POST /api/email/test`

### Activity Logs Not Recording

1. Verify user is authenticated
2. Check middleware is applied to routes
3. Verify MongoDB connection
4. Check `ActivityService.logActivity()` is being called

### Cron Job Not Running

1. Check `ENABLE_CRON_JOBS=true`
2. Verify cron schedule syntax
3. Check server logs for errors
4. Verify MongoDB connection

## Production Checklist

- [ ] Configure HTTPS
- [ ] Set `NODE_ENV=production`
- [ ] Enable email queue processing
- [ ] Setup automatic cron job execution
- [ ] Configure backups
- [ ] Setup monitoring and alerts
- [ ] Test email delivery
- [ ] Implement rate limiting
- [ ] Setup audit logging
- [ ] Configure error tracking (Sentry)
- [ ] Test disaster recovery
- [ ] Document all configurations
