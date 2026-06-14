// src/config/nodemailer.js
const nodemailer = require('nodemailer');

const initializeEmailTransport = () => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.GMAIL_SERVICE || 'gmail',
      host: process.env.GMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.GMAIL_PORT) || 587,
      secure: process.env.GMAIL_SECURE === 'true' || false,
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    // Verify connection configuration
    transporter.verify((error, success) => {
      if (error) {
        console.error('✗ Email transporter verification failed:', error.message);
      } else {
        console.log('✓ Email transporter ready to send messages');
      }
    });

    return transporter;
  } catch (error) {
    console.error('✗ Failed to initialize email transporter:', error.message);
    throw error;
  }
};

module.exports = { initializeEmailTransport };
