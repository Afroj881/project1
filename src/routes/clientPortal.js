const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const clientOnly = require('../middleware/clientOnly');
const controller = require('../controllers/clientPortalController');
const { validateFeedback } = require('../validators/clientPortalValidators');

router.use(authenticate, clientOnly);

router.get('/dashboard', controller.getDashboard);
router.get('/projects', controller.getProjects);
router.get('/projects/:id', controller.getProjectById);
router.get('/invoices', controller.getInvoices);
router.post('/feedback', validateFeedback, controller.postFeedback);

module.exports = router;
