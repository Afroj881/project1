// src/middleware/validation.js
const { AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * Validate pagination query parameters
 */
const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  if (page < 1) {
    throw new AppError('Page must be at least 1', 400);
  }

  if (limit < 1 || limit > 100) {
    throw new AppError('Limit must be between 1 and 100', 400);
  }

  req.pagination = { page, limit };
  next();
};

/**
 * Validate activity filter parameters
 */
const validateActivityFilters = (req, res, next) => {
  const filters = {};

  if (req.query.userId) {
    filters.userId = req.query.userId;
  }

  if (req.query.action) {
    const validActions = [
      'PROJECT_CREATED',
      'PROJECT_UPDATED',
      'TASK_CREATED',
      'TASK_ASSIGNED',
      'TASK_STATUS_CHANGED',
      'COMMENT_ADDED',
      'FILE_UPLOADED',
      'INVOICE_GENERATED',
      'INVOICE_PAID',
      'TEAM_INVITATION_SENT',
      'ROLE_UPDATED',
    ];

    if (!validActions.includes(req.query.action)) {
      throw new AppError(`Invalid action: ${req.query.action}`, 400);
    }

    filters.action = req.query.action;
  }

  if (req.query.entity) {
    const validEntities = ['PROJECT', 'TASK', 'COMMENT', 'FILE', 'INVOICE', 'TEAM', 'CLIENT', 'USER'];

    if (!validEntities.includes(req.query.entity)) {
      throw new AppError(`Invalid entity: ${req.query.entity}`, 400);
    }

    filters.entity = req.query.entity;
  }

  if (req.query.projectId) {
    filters.projectId = req.query.projectId;
  }

  if (req.query.startDate) {
    const startDate = new Date(req.query.startDate);
    if (isNaN(startDate.getTime())) {
      throw new AppError('Invalid startDate format', 400);
    }
    filters.startDate = startDate;
  }

  if (req.query.endDate) {
    const endDate = new Date(req.query.endDate);
    if (isNaN(endDate.getTime())) {
      throw new AppError('Invalid endDate format', 400);
    }
    filters.endDate = endDate;
  }

  if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
    throw new AppError('startDate must be before endDate', 400);
  }

  req.filters = filters;
  next();
};

/**
 * Validate email format
 */
const validateEmail = (req, res, next) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (req.body.email && !emailRegex.test(req.body.email)) {
    throw new AppError('Invalid email format', 400);
  }

  next();
};

/**
 * Validate required fields
 */
const validateRequiredFields = (fields) => {
  return (req, res, next) => {
    const missingFields = fields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400);
    }

    next();
  };
};

module.exports = {
  validatePagination,
  validateActivityFilters,
  validateEmail,
  validateRequiredFields,
};
