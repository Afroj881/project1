// src/middleware/errorHandler.js
const logger = require('../utils/logger');

/**
 * Global error handling middleware
 */
const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error('Request error:', {
    statusCode,
    message,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
    error: err.stack,
  });

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 Not Found middleware
 */
const notFoundHandler = (req, res, next) => {
  const error = {
    status: 'error',
    statusCode: 404,
    message: `Route not found: ${req.method} ${req.path}`,
    timestamp: new Date().toISOString(),
  };

  logger.warn('404 Not Found:', { path: req.path, method: req.method });
  res.status(404).json(error);
};

module.exports = {
  globalErrorHandler,
  notFoundHandler,
};
