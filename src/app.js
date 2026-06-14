const express = require('express');
const morgan = require('morgan');
let helmet;
try { helmet = require('helmet'); } catch (e) { helmet = null; }
const clientPortalRoutes = require('./routes/clientPortal');
const { errorHandler } = require('./utils/errorHandler');
const activityLogger = require('./middleware/activityLogger');

const app = express();

if (helmet) app.use(helmet());

app.use(morgan('dev'));
app.use(express.json());
app.use(activityLogger);

app.use('/api/client-portal', clientPortalRoutes);

app.use(errorHandler);

module.exports = app;
