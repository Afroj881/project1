const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

module.exports = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/task_management_api',
  jwtSecret: process.env.JWT_SECRET || 'jwt-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2d',
};
