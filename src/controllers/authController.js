import { loginUser } from '../services/authService.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  const data = await loginUser({ email, password });
  res.json(data);
};
