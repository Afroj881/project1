// src/middleware/index.js
module.exports = {
  ...require('./auth'),
  ...require('./validation'),
  ...require('./errorHandler'),
};
