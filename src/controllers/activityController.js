// src/controllers/activityController.js
const ActivityService = require('../services/activityService');
const { asyncHandler, AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * Get activity logs with filtering and pagination
 */
const getActivityLogs = asyncHandler(async (req, res) => {
  const { filters, pagination } = req;

  const result = await ActivityService.getActivityLogs(
    filters,
    pagination.page,
    pagination.limit
  );

  logger.info('Activity logs retrieved', {
    page: pagination.page,
    limit: pagination.limit,
    total: result.pagination.total,
  });

  res.status(200).json({
    status: 'success',
    data: result.logs,
    pagination: result.pagination,
  });
});

/**
 * Get user activity
 */
const getUserActivity = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { pagination } = req;

  if (!userId) {
    throw new AppError('User ID is required', 400);
  }

  const result = await ActivityService.getUserActivity(
    userId,
    pagination.page,
    pagination.limit
  );

  logger.info('User activity retrieved', {
    userId,
    page: pagination.page,
    limit: pagination.limit,
  });

  res.status(200).json({
    status: 'success',
    data: result.logs,
    pagination: result.pagination,
  });
});

/**
 * Get project activity
 */
const getProjectActivity = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { pagination } = req;

  if (!projectId) {
    throw new AppError('Project ID is required', 400);
  }

  const result = await ActivityService.getProjectActivity(
    projectId,
    pagination.page,
    pagination.limit
  );

  logger.info('Project activity retrieved', {
    projectId,
    page: pagination.page,
    limit: pagination.limit,
  });

  res.status(200).json({
    status: 'success',
    data: result.logs,
    pagination: result.pagination,
  });
});

/**
 * Get entity activity
 */
const getEntityActivity = asyncHandler(async (req, res) => {
  const { entity, entityId } = req.params;
  const { pagination } = req;

  if (!entity || !entityId) {
    throw new AppError('Entity and Entity ID are required', 400);
  }

  const result = await ActivityService.getEntityActivity(
    entity,
    entityId,
    pagination.page,
    pagination.limit
  );

  logger.info('Entity activity retrieved', {
    entity,
    entityId,
    page: pagination.page,
    limit: pagination.limit,
  });

  res.status(200).json({
    status: 'success',
    data: result.logs,
    pagination: result.pagination,
  });
});

/**
 * Get activity summary/dashboard
 */
const getActivitySummary = asyncHandler(async (req, res) => {
  const { projectId, userId, days = 30 } = req.query;

  const filters = {};
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));
  filters.startDate = startDate;

  if (projectId) filters.projectId = projectId;
  if (userId) filters.userId = userId;

  const result = await ActivityService.getActivityLogs(filters, 1, 1000);

  // Group by action
  const summary = {};
  result.logs.forEach(log => {
    summary[log.action] = (summary[log.action] || 0) + 1;
  });

  logger.info('Activity summary retrieved', {
    projectId,
    userId,
    days,
  });

  res.status(200).json({
    status: 'success',
    data: {
      summary,
      totalActivities: result.pagination.total,
      period: { days: parseInt(days), startDate },
    },
  });
});

module.exports = {
  getActivityLogs,
  getUserActivity,
  getProjectActivity,
  getEntityActivity,
  getActivitySummary,
};
