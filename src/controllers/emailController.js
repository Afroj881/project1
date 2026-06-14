// src/controllers/emailController.js
const EmailService = require('../services/emailService');
const EmailQueue = require('../models/EmailQueue');
const { asyncHandler, AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * Process pending emails from queue
 */
const processEmailQueue = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;

  const result = await EmailService.processEmailQueue(limit);

  logger.info('Email queue processed', result);

  res.status(200).json({
    status: 'success',
    message: 'Email queue processed successfully',
    data: result,
  });
});

/**
 * Get email queue status
 */
const getQueueStatus = asyncHandler(async (req, res) => {
  const pending = await EmailQueue.countDocuments({ status: 'pending' });
  const retrying = await EmailQueue.countDocuments({ status: 'retrying' });
  const sent = await EmailQueue.countDocuments({ status: 'sent' });
  const failed = await EmailQueue.countDocuments({ status: 'failed' });

  res.status(200).json({
    status: 'success',
    data: {
      pending,
      retrying,
      sent,
      failed,
      total: pending + retrying + sent + failed,
    },
  });
});

/**
 * Get queued emails
 */
const getQueuedEmails = asyncHandler(async (req, res) => {
  const { status = 'pending', limit = 20, page = 1 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [emails, total] = await Promise.all([
    EmailQueue.find(status ? { status } : {})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    EmailQueue.countDocuments(status ? { status } : {}),
  ]);

  res.status(200).json({
    status: 'success',
    data: emails,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * Retry failed email
 */
const retryFailedEmail = asyncHandler(async (req, res) => {
  const { emailId } = req.params;

  const email = await EmailQueue.findById(emailId);

  if (!email) {
    throw new AppError('Email not found', 404);
  }

  if (email.status !== 'failed') {
    throw new AppError('Only failed emails can be retried', 400);
  }

  email.status = 'pending';
  email.retryCount = 0;
  email.error = null;
  await email.save();

  logger.info('Email marked for retry', { emailId });

  res.status(200).json({
    status: 'success',
    message: 'Email marked for retry',
    data: email,
  });
});

/**
 * Send test email
 */
const sendTestEmail = asyncHandler(async (req, res) => {
  const { to, subject, template } = req.body;

  if (!to || !subject) {
    throw new AppError('Email and subject are required', 400);
  }

  const testData = {
    recipientName: 'Test User',
    recipientEmail: to,
    projectName: 'Test Project',
    taskTitle: 'Test Task',
  };

  const result = await EmailService.sendEmail({
    to,
    subject,
    html: `<h1>${subject}</h1><p>This is a test email from the system.</p>`,
  });

  logger.info('Test email sent', { to });

  res.status(200).json({
    status: 'success',
    message: 'Test email sent successfully',
    data: result,
  });
});

module.exports = {
  processEmailQueue,
  getQueueStatus,
  getQueuedEmails,
  retryFailedEmail,
  sendTestEmail,
};
