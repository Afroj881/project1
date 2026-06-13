import { User } from '../models/User.js';
import { signAuthToken } from '../utils/token.js';

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || user.status !== 'Active') {
    throw Object.assign(new Error('Incorrect email or password'), { statusCode: 401 });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw Object.assign(new Error('Incorrect email or password'), { statusCode: 401 });
  }

  const token = signAuthToken({ id: user._id, role: user.role, email: user.email });
  return { token, user: { id: user._id, email: user.email, name: user.name, role: user.role, status: user.status } };
};
