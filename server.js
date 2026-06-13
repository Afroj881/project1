const dotenv = require('dotenv');
const http = require('http');
const app = require('./src/app');
const connectDatabase = require('./config/db');
const config = require('./config/index');

dotenv.config();

connectDatabase(config.mongoUri)
  .then(() => {
    const server = http.createServer(app);
    server.listen(config.port, () => {
      console.log(`Task Management API listening on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
