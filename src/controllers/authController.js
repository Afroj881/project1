const jwt = require('jsonwebtoken');
const config = require('../../config/index');
const { registerUser, authenticateUser } = require('../services/userService');

const register = async (req, res) => {
  const user = await registerUser(req.body);
  const token = jwt.sign({ userId: user._id, role: user.role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

  res.status(201).json({ success: true, data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token } });
};

const login = async (req, res) => {
  const { user, token } = await authenticateUser(req.body);
  res.json({ success: true, data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token } });
};

module.exports = { register, login };
