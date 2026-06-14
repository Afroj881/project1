// server.js
require('dotenv').config();
const express = require('express');
const { connectDB } = require('./src/config/database');
const { globalErrorHandler, notFoundHandler } = require('./src/middleware');
const { asyncHandler } = require('./src/utils/errorHandler');
const logger = require('./src/utils/logger');
const routes = require('./src/routes');
const { startCronJobs } = require('./src/cron/deadlineReminder');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start cron jobs
    startCronJobs();

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`, {
        environment: process.env.NODE_ENV || 'development',
        mongoUri: process.env.MONGODB_URI,
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', { error: error.message });
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...');
  const { disconnectDB } = require('./src/config/database');
  await disconnectDB();
  process.exit(0);
});

module.exports = app;
