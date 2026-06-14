// src/routes/index.js
const express = require('express');
const router = express.Router();

const activityRoutes = require('./activityRoutes');
const emailRoutes = require('./emailRoutes');

router.use('/activity', activityRoutes);
router.use('/email', emailRoutes);

module.exports = router;
