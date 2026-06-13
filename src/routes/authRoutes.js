const express = require('express');
const { login, register } = require('../controllers/authController');
const { validateRequest } = require('../middleware/validateRequest');
const { authRegisterSchema, authLoginSchema } = require('../utils/validators');

const router = express.Router();

router.post('/register', validateRequest(authRegisterSchema), register);
router.post('/login', validateRequest(authLoginSchema), login);

module.exports = router;
