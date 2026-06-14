// src/services/emailService.js
const nodemailer = require('nodemailer');
const EmailQueue = require('../models/EmailQueue');
const logger = require('../utils/logger');
const templates = require('../templates');

let transporter = null;

const initializeTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: process.env.GMAIL_SERVICE || 'gmail',
      host: process.env.GMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.GMAIL_PORT) || 587,
      secure: process.env.GMAIL_SECURE === 'true' || false,
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    transporter.verify((error, success) => {
      if (error) {
        logger.error('Email transporter verification failed:', { error: error.message });
      } else {
        logger.info('Email transporter ready to send messages');
      }
    });
  }
  return transporter;
};

class EmailService {
  /**
   * Send email directly
   * @param {Object} options - Email options
   * @returns {Promise<Object>} - Email send result
   */
  static async sendEmail(options) {
    try {
      const transporter = initializeTransporter();
      
      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_EMAIL}>`,
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        html: options.html,
        attachments: options.attachments,
      };

      const result = await transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${options.subject}`, { to: options.to });
      return result;
    } catch (error) {
      logger.error('Failed to send email:', { error: error.message, to: options.to });
      throw error;
    }
  }

  /**
   * Queue email for later sending
   * @param {Object} emailData - Email data
   * @returns {Promise<Object>} - Queued email record
   */
  static async queueEmail(emailData) {
    try {
      const queueRecord = await EmailQueue.addToQueue({
        to: emailData.to,
        cc: emailData.cc,
        bcc: emailData.bcc,
        subject: emailData.subject,
        template: emailData.template,
        data: emailData.data,
        html: emailData.html,
        attachments: emailData.attachments,
        userId: emailData.userId,
        status: 'pending',
      });

      logger.info('Email queued:', { to: emailData.to, template: emailData.template });
      return queueRecord;
    } catch (error) {
      logger.error('Failed to queue email:', { error: error.message });
      throw error;
    }
  }

  /**
   * Send or queue email based on config
   * @param {Object} emailData - Email data
   * @param {boolean} immediate - Send immediately or queue
   * @returns {Promise} - Send or queue result
   */
  static async sendOrQueueEmail(emailData, immediate = false) {
    try {
      if (immediate || !process.env.ENABLE_EMAIL_QUEUE) {
        return await this.sendEmail(emailData);
      } else {
        return await this.queueEmail(emailData);
      }
    } catch (error) {
      logger.error('Error in sendOrQueueEmail:', { error: error.message });
      throw error;
    }
  }

  /**
   * Process email queue
   * @param {number} limit - Max emails to process
   * @returns {Promise<Object>} - Processing result
   */
  static async processEmailQueue(limit = 10) {
    try {
      const pendingEmails = await EmailQueue.getPendingEmails(limit);
      
      if (pendingEmails.length === 0) {
        logger.debug('No pending emails to process');
        return { processed: 0, failed: 0 };
      }

      let processed = 0;
      let failed = 0;

      for (const email of pendingEmails) {
        try {
          const result = await this.sendEmail({
            to: email.to,
            cc: email.cc,
            bcc: email.bcc,
            subject: email.subject,
            html: email.html,
            attachments: email.attachments,
          });

          email.status = 'sent';
          email.sentAt = new Date();
          await email.save();
          processed++;

          logger.info('Queued email sent:', { to: email.to, template: email.template });
        } catch (error) {
          email.retryCount += 1;
          email.error = error.message;

          if (email.retryCount >= email.maxRetries) {
            email.status = 'failed';
            email.failedAt = new Date();
          } else {
            email.status = 'retrying';
          }

          await email.save();
          failed++;

          logger.warn('Failed to send queued email:', {
            to: email.to,
            retryCount: email.retryCount,
            error: error.message,
          });
        }
      }

      return { processed, failed, total: pendingEmails.length };
    } catch (error) {
      logger.error('Error processing email queue:', { error: error.message });
      throw error;
    }
  }

  /**
   * Send task assigned email
   */
  static async sendTaskAssignedEmail(data) {
    try {
      const html = templates.taskAssigned(data);
      return await this.sendOrQueueEmail({
        to: data.recipientEmail,
        subject: `Task Assigned: ${data.taskTitle}`,
        template: 'TASK_ASSIGNED',
        html,
        data,
        userId: data.userId,
      });
    } catch (error) {
      logger.error('Failed to send task assigned email:', { error: error.message });
      throw error;
    }
  }

  /**
   * Send deadline reminder email
   */
  static async sendDeadlineReminderEmail(data) {
    try {
      const html = templates.deadlineReminder(data);
      return await this.sendOrQueueEmail({
        to: data.recipientEmail,
        subject: `Project Deadline Reminder: ${data.projectName}`,
        template: 'DEADLINE_REMINDER',
        html,
        data,
        userId: data.userId,
      });
    } catch (error) {
      logger.error('Failed to send deadline reminder email:', { error: error.message });
      throw error;
    }
  }

  /**
   * Send invoice delivery email
   */
  static async sendInvoiceDeliveryEmail(data, pdfAttachment = null) {
    try {
      const html = templates.invoiceDelivery(data);
      const attachments = [];

      if (pdfAttachment) {
        attachments.push({
          filename: `${data.invoiceNumber}.pdf`,
          content: pdfAttachment,
          contentType: 'application/pdf',
        });
      }

      return await this.sendOrQueueEmail({
        to: data.recipientEmail,
        subject: `Invoice ${data.invoiceNumber}`,
        template: 'INVOICE_DELIVERY',
        html,
        attachments,
        data,
        userId: data.userId,
      });
    } catch (error) {
      logger.error('Failed to send invoice delivery email:', { error: error.message });
      throw error;
    }
  }

  /**
   * Send invoice overdue email
   */
  static async sendInvoiceOverdueEmail(data) {
    try {
      const html = templates.invoiceOverdue(data);
      return await this.sendOrQueueEmail({
        to: data.recipientEmail,
        subject: `Invoice Payment Overdue: ${data.invoiceNumber}`,
        template: 'INVOICE_OVERDUE',
        html,
        data,
        userId: data.userId,
      });
    } catch (error) {
      logger.error('Failed to send invoice overdue email:', { error: error.message });
      throw error;
    }
  }

  /**
   * Send team invitation email
   */
  static async sendTeamInvitationEmail(data) {
    try {
      const html = templates.teamInvitation(data);
      return await this.sendOrQueueEmail({
        to: data.recipientEmail,
        subject: `Team Invitation: ${data.projectName}`,
        template: 'TEAM_INVITATION',
        html,
        data,
        userId: data.userId,
      });
    } catch (error) {
      logger.error('Failed to send team invitation email:', { error: error.message });
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(data) {
    try {
      const html = templates.passwordReset(data);
      return await this.sendOrQueueEmail({
        to: data.recipientEmail,
        subject: 'Password Reset Request',
        template: 'PASSWORD_RESET',
        html,
        data,
        userId: data.userId,
      });
    } catch (error) {
      logger.error('Failed to send password reset email:', { error: error.message });
      throw error;
    }
  }

  /**
   * Send comment notification email
   */
  static async sendCommentNotificationEmail(data) {
    try {
      const html = templates.commentNotification(data);
      return await this.sendOrQueueEmail({
        to: data.recipientEmail,
        subject: `New Comment: ${data.taskTitle}`,
        template: 'COMMENT_NOTIFICATION',
        html,
        data,
        userId: data.userId,
      });
    } catch (error) {
      logger.error('Failed to send comment notification email:', { error: error.message });
      throw error;
    }
  }
}

module.exports = EmailService;
