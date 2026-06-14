// src/routes/activityRoutes.js
const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { verifyToken, captureMetadata } = require('../middleware/auth');
const { validatePagination, validateActivityFilters } = require('../middleware/validation');
const { asyncHandler } = require('../utils/errorHandler');

// Apply middleware
router.use(verifyToken);
router.use(captureMetadata);
router.use(validatePagination);

/**
 * GET /api/activity
 * Get activity logs with filtering and pagination
 */
router.get('/', validateActivityFilters, activityController.getActivityLogs);

/**
 * GET /api/activity/summary
 * Get activity summary/dashboard
 */
router.get('/summary', activityController.getActivitySummary);

/**
 * GET /api/activity/user/:userId
 * Get user-specific activity logs
 */
router.get('/user/:userId', activityController.getUserActivity);

/**
 * GET /api/activity/project/:projectId
 * Get project-specific activity logs
 */
router.get('/project/:projectId', activityController.getProjectActivity);

/**
 * GET /api/activity/entity/:entity/:entityId
 * Get entity-specific activity logs
 */
router.get('/entity/:entity/:entityId', activityController.getEntityActivity);

module.exports = router;
