// src/models/EmailQueue.js
const mongoose = require('mongoose');

const emailQueueSchema = new mongoose.Schema(
  {
    to: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    cc: [String],
    bcc: [String],
    subject: {
      type: String,
      required: true,
    },
    template: {
      type: String,
      required: true,
      enum: [
        'TASK_ASSIGNED',
        'DEADLINE_REMINDER',
        'INVOICE_DELIVERY',
        'INVOICE_OVERDUE',
        'TEAM_INVITATION',
        'PASSWORD_RESET',
        'COMMENT_NOTIFICATION',
        'PROJECT_UPDATE',
        'TASK_UPDATE',
      ],
    },
    data: mongoose.Schema.Types.Mixed,
    html: String,
    attachments: [
      {
        filename: String,
        content: mongoose.Schema.Types.Mixed,
        contentType: String,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'retrying'],
      default: 'pending',
      index: true,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    maxRetries: {
      type: Number,
      default: parseInt(process.env.EMAIL_RETRY_LIMIT || 3),
    },
    error: String,
    sentAt: Date,
    failedAt: Date,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

emailQueueSchema.index({ status: 1, createdAt: 1 });
emailQueueSchema.index({ to: 1 });
emailQueueSchema.index({ userId: 1, createdAt: -1 });

emailQueueSchema.statics.addToQueue = async function (emailData) {
  try {
    const queue = new this(emailData);
    await queue.save();
    return queue;
  } catch (error) {
    console.error('Error adding email to queue:', error);
    throw error;
  }
};

emailQueueSchema.statics.getPendingEmails = async function (limit = 10) {
  return this.find({
    status: { $in: ['pending', 'retrying'] },
  })
    .sort({ createdAt: 1 })
    .limit(limit)
    .exec();
};

module.exports = mongoose.model('EmailQueue', emailQueueSchema);
