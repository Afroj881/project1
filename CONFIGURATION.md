# Configuration Guide

## Environment Setup

### Gmail Configuration

1. **Enable 2-Step Verification**
   - Go to myaccount.google.com
   - Click "Security" in the left menu
   - Enable "2-Step Verification"

2. **Generate App Password**
   - Go to myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Google will generate a 16-character password
   - Use this password in `.env` as `GMAIL_PASSWORD`

3. **Configure .env**
   ```env
   GMAIL_EMAIL=your-email@gmail.com
   GMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   GMAIL_SERVICE=gmail
   GMAIL_HOST=smtp.gmail.com
   GMAIL_PORT=587
   GMAIL_SECURE=false
   ```

### MongoDB Configuration

#### Local Setup

```env
MONGODB_URI=mongodb://localhost:27017/email-notification-db
MONGODB_TEST_URI=mongodb://localhost:27017/email-notification-test
```

#### MongoDB Atlas (Cloud)

1. Create account at mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/email-notification-db?retryWrites=true&w=majority
   ```

### JWT Configuration

Generate secure secrets:

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Configure in `.env`:
```env
JWT_SECRET=<generated-secret>
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=<another-generated-secret>
JWT_REFRESH_EXPIRE=30d
```

### Application URLs

Configure based on your environment:

```env
# Development
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001

# Production
APP_URL=https://api.example.com
FRONTEND_URL=https://example.com
```

### Email Configuration

Customize sender information:

```env
EMAIL_FROM_NAME=Project Management System
EMAIL_FROM_EMAIL=notifications@example.com
EMAIL_RETRY_LIMIT=3
EMAIL_RETRY_DELAY=5000
```

### Cron Job Configuration

#### Deadline Reminder Schedule

Cron syntax: `minute hour day month dayOfWeek`

```env
# Examples:
CRON_DEADLINE_REMINDER_SCHEDULE=0 9 * * *        # Every day at 9 AM
CRON_DEADLINE_REMINDER_SCHEDULE=0 9 * * 1-5      # Weekdays at 9 AM
CRON_DEADLINE_REMINDER_SCHEDULE=0 18 * * *       # Every day at 6 PM
CRON_DEADLINE_REMINDER_SCHEDULE=*/30 * * * *     # Every 30 minutes
```

Enable/disable:
```env
ENABLE_CRON_JOBS=true   # Enable
ENABLE_CRON_JOBS=false  # Disable
```

### Email Queue Configuration

```env
# Enable queue
ENABLE_EMAIL_QUEUE=true

# Batch processing
EMAIL_QUEUE_BATCH_SIZE=10
EMAIL_QUEUE_PROCESS_INTERVAL=5000  # milliseconds

# Retry logic
EMAIL_RETRY_LIMIT=3
EMAIL_RETRY_DELAY=5000
```

### Pagination

```env
PAGINATION_LIMIT=20
PAGINATION_DEFAULT_PAGE=1
```

### Logging

```env
LOG_LEVEL=debug              # error, warn, info, debug
LOG_FILE_PATH=./logs/app.log
```

### Activity Log Configuration

```env
ACTIVITY_LOG_RETENTION_DAYS=90  # Auto-cleanup old logs
ACTIVITY_LOG_BATCH_SIZE=100     # Batch size for operations
```

## Complete .env Example

```env
# ===== Server Configuration =====
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000

# ===== MongoDB Configuration =====
MONGODB_URI=mongodb://localhost:27017/email-notification-db
MONGODB_TEST_URI=mongodb://localhost:27017/email-notification-test

# ===== Gmail SMTP Configuration =====
GMAIL_EMAIL=your-email@gmail.com
GMAIL_PASSWORD=xxxx xxxx xxxx xxxx
GMAIL_SERVICE=gmail
GMAIL_HOST=smtp.gmail.com
GMAIL_PORT=587
GMAIL_SECURE=false

# ===== Email Configuration =====
EMAIL_FROM_NAME=Project Management System
EMAIL_FROM_EMAIL=your-email@gmail.com
EMAIL_RETRY_LIMIT=3
EMAIL_RETRY_DELAY=5000

# ===== JWT Configuration =====
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-key-here
JWT_REFRESH_EXPIRE=30d

# ===== Application URLs =====
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001

# ===== Cron Job Configuration =====
CRON_DEADLINE_REMINDER_SCHEDULE=0 9 * * *
ENABLE_CRON_JOBS=true

# ===== Email Queue Configuration =====
ENABLE_EMAIL_QUEUE=true
EMAIL_QUEUE_BATCH_SIZE=10
EMAIL_QUEUE_PROCESS_INTERVAL=5000

# ===== Activity Log Configuration =====
ACTIVITY_LOG_RETENTION_DAYS=90
ACTIVITY_LOG_BATCH_SIZE=100

# ===== Pagination =====
PAGINATION_LIMIT=20
PAGINATION_DEFAULT_PAGE=1

# ===== Logging =====
LOG_LEVEL=debug
LOG_FILE_PATH=./logs/app.log
```

## Production Configuration

### Security

```env
NODE_ENV=production
JWT_SECRET=<very-long-cryptographically-secure-secret>
JWT_REFRESH_SECRET=<another-very-long-cryptographically-secure-secret>
```

### Database

Use MongoDB Atlas or managed service:

```env
MONGODB_URI=mongodb+srv://user:password@production-cluster.mongodb.net/email-notification-prod?retryWrites=true&w=majority
```

### Email

Use production Gmail account:

```env
GMAIL_EMAIL=production@example.com
GMAIL_PASSWORD=<app-specific-password>
GMAIL_SECURE=true
GMAIL_PORT=465
```

### URLs

```env
APP_URL=https://api.example.com
FRONTEND_URL=https://example.com
```

### Logging

```env
LOG_LEVEL=info
LOG_FILE_PATH=/var/log/app/app.log
```

### Email Queue

```env
ENABLE_EMAIL_QUEUE=true
EMAIL_QUEUE_BATCH_SIZE=20
EMAIL_QUEUE_PROCESS_INTERVAL=60000  # 1 minute
```

## Development Configuration

```env
NODE_ENV=development
LOG_LEVEL=debug
ENABLE_EMAIL_QUEUE=false  # Send immediately for testing
ENABLE_CRON_JOBS=false     # Disable auto-running cron jobs
```

## Testing Configuration

```env
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/email-notification-test
ENABLE_EMAIL_QUEUE=false
ENABLE_CRON_JOBS=false
LOG_LEVEL=error
```

## Database Indexes

Indexes are automatically created when models are loaded, but you can manually create them:

```javascript
// In MongoDB shell
use email-notification-db

// Activity Log indexes
db.activityLogs.createIndex({ userId: 1, createdAt: -1 })
db.activityLogs.createIndex({ action: 1, createdAt: -1 })
db.activityLogs.createIndex({ projectId: 1, createdAt: -1 })
db.activityLogs.createIndex({ entity: 1, entityId: 1, createdAt: -1 })
db.activityLogs.createIndex({ createdAt: -1 })

// Email Queue indexes
db.emailqueues.createIndex({ status: 1, createdAt: 1 })
db.emailqueues.createIndex({ to: 1 })
db.emailqueues.createIndex({ userId: 1, createdAt: -1 })

// User indexes
db.users.createIndex({ email: 1 })
db.users.createIndex({ createdAt: -1 })

// Task indexes
db.tasks.createIndex({ projectId: 1, createdAt: -1 })
db.tasks.createIndex({ assignedTo: 1 })
db.tasks.createIndex({ status: 1 })

// Invoice indexes
db.invoices.createIndex({ clientId: 1, createdAt: -1 })
db.invoices.createIndex({ status: 1, dueDate: 1 })
```

## Cron Schedule Examples

### Common Schedules

```env
# Every day at 9 AM
0 9 * * *

# Every Monday at 9 AM
0 9 * * 1

# Every weekday at 9 AM
0 9 * * 1-5

# Every hour
0 * * * *

# Every 30 minutes
*/30 * * * *

# Every day at noon and midnight
0 0,12 * * *

# Every 1st of the month at 9 AM
0 9 1 * *

# Every quarter (1st of Jan, Apr, Jul, Oct) at 9 AM
0 9 1 1,4,7,10 *
```

## Performance Tuning

### Connection Pooling

MongoDB connection pooling is handled automatically by Mongoose. Default pool size is 10.

### Query Optimization

1. Always use pagination for large datasets
2. Use projection to limit fields returned
3. Create indexes for frequently queried fields

Example:

```javascript
// Instead of:
const logs = await ActivityLog.find({ projectId });

// Use:
const logs = await ActivityLog.find({ projectId })
  .select('userId action entity description createdAt')
  .sort({ createdAt: -1 })
  .limit(20)
  .lean();
```

### Email Queue Processing

Process queue at regular intervals:

```bash
# Create cron job (Linux)
crontab -e

# Add:
*/5 * * * * curl -X POST http://localhost:3000/api/email/process-queue -H "Authorization: Bearer token"
```

## Monitoring and Alerts

### Application Health

Check server health:

```bash
curl http://localhost:3000/health
```

### Database Monitoring

Monitor MongoDB:

```bash
# MongoDB Atlas: Use built-in monitoring dashboard
# Local MongoDB: Use mongostat
mongostat --host localhost
```

### Email Queue Monitoring

```bash
# Check queue status regularly
curl -X GET http://localhost:3000/api/email/queue/status \
  -H "Authorization: Bearer admin_token"
```

### Log Analysis

```bash
# View recent errors
grep ERROR logs/app.log | tail -20

# Count errors by type
grep ERROR logs/app.log | awk '{print $NF}' | sort | uniq -c

# Real-time log monitoring
tail -f logs/app.log
```

## Backup Strategy

### MongoDB Backup

```bash
# Local backup
mongodump --db email-notification-db --out ./backup

# MongoDB Atlas: Use automated backups in dashboard
```

### Email Templates Backup

```bash
# Backup templates directory
cp -r src/templates/ backup/templates_$(date +%Y%m%d)
```

### Configuration Backup

```bash
# Backup .env (without secrets in production)
grep -E '^(NODE_ENV|PORT|MONGODB_RETENTION)' .env > backup/.env.config
```

## Disaster Recovery

1. **Database Loss**: Restore from backup
2. **Email Queue Failure**: Emails can be retried
3. **Server Crash**: Use process manager (PM2) to auto-restart
4. **Data Corruption**: Use MongoDB transactions for consistency
