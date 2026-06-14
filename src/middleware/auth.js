// src/middleware/auth.js
const { AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * Verify JWT token and extract user information
 * This is a mock implementation - replace with actual JWT verification
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Missing or invalid authorization header', 401);
    }

    const token = authHeader.substring(7);
    
    // Mock token verification - implement with JWT in production
    if (!token) {
      throw new AppError('Invalid token', 401);
    }

    // In production, verify token and extract payload
    // For now, we'll mock the user data
    req.user = {
      id: 'mock-user-id',
      email: 'user@example.com',
      role: 'admin',
    };

    logger.debug('Token verified', { userId: req.user.id });
    next();
  } catch (error) {
    logger.warn('Token verification failed:', { error: error.message });
    res.status(error.statusCode || 401).json({
      status: 'error',
      message: error.message || 'Unauthorized',
    });
  }
};

/**
 * Check if user is authenticated
 */
const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }
  next();
};

/**
 * Check if user has required role
 */
const hasRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError('User does not have required role', 403);
    }

    next();
  };
};

/**
 * Capture request metadata (IP, User-Agent)
 */
const captureMetadata = (req, res, next) => {
  req.metadata = {
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'],
    timestamp: new Date(),
  };
  next();
};

module.exports = {
  verifyToken,
  isAuthenticated,
  hasRole,
  captureMetadata,
};
