import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const generateInviteToken = () => crypto.randomBytes(32).toString('hex');

export const signAuthToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

export const verifyAuthToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }
  return jwt.verify(token, process.env.JWT_SECRET);
};
