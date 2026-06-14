// src/utils/logger.js
const fs = require('fs');
const path = require('path');

const logDir = process.env.LOG_FILE_PATH || './logs';

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const LogLevel = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

const getCurrentLogLevel = () => {
  const level = process.env.LOG_LEVEL || 'info';
  const levels = { error: 0, warn: 1, info: 2, debug: 3 };
  return levels[level.toLowerCase()] || 2;
};

const log = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...data,
  };

  const levelValue = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
  };

  if (levelValue[level] <= getCurrentLogLevel()) {
    console.log(`[${level}] [${timestamp}] ${message}`, data);
  }

  // Always write to file
  const logFile = path.join(logDir, 'app.log');
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
};

module.exports = {
  error: (message, data) => log(LogLevel.ERROR, message, data),
  warn: (message, data) => log(LogLevel.WARN, message, data),
  info: (message, data) => log(LogLevel.INFO, message, data),
  debug: (message, data) => log(LogLevel.DEBUG, message, data),
};
