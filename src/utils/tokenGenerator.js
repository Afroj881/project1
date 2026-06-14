// src/utils/tokenGenerator.js
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

const generateInvitationToken = () => {
  return uuidv4();
};

const generateOTP = (length = 6) => {
  return Math.random().toString().substring(2, 2 + length);
};

const generateResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return {
    token,
    hash,
    expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  };
};

const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `INV-${year}${month}-${random}`;
};

module.exports = {
  generateSecureToken,
  generateInvitationToken,
  generateOTP,
  generateResetToken,
  generateInvoiceNumber,
};
