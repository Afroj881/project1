// src/routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const { verifyToken, hasRole } = require('../middleware/auth');
const { asyncHandler } = require('../utils/errorHandler');

// Apply middleware
router.use(verifyToken);

/**
 * POST /api/email/process-queue
 * Process pending emails from queue
 * Requires admin role
 */
router.post('/process-queue', hasRole(['admin']), emailController.processEmailQueue);

/**
 * GET /api/email/queue/status
 * Get email queue status
 * Requires admin role
 */
router.get('/queue/status', hasRole(['admin']), emailController.getQueueStatus);

/**
 * GET /api/email/queue
 * Get queued emails
 * Requires admin role
 */
router.get('/queue', hasRole(['admin']), emailController.getQueuedEmails);

/**
 * POST /api/email/retry/:emailId
 * Retry failed email
 * Requires admin role
 */
router.post('/retry/:emailId', hasRole(['admin']), emailController.retryFailedEmail);

/**
 * POST /api/email/test
 * Send test email
 * Requires admin role
 */
router.post('/test', hasRole(['admin']), emailController.sendTestEmail);

module.exports = router;
