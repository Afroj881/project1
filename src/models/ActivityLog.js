// src/models/ActivityLog.js
const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: 'User',
      description: 'Reference to the user who performed the action',
    },
    action: {
      type: String,
      required: true,
      enum: [
        'PROJECT_CREATED',
        'PROJECT_UPDATED',
        'PROJECT_DELETED',
        'TASK_CREATED',
        'TASK_UPDATED',
        'TASK_STATUS_CHANGED',
        'TASK_ASSIGNED',
        'TASK_DELETED',
        'COMMENT_ADDED',
        'COMMENT_UPDATED',
        'COMMENT_DELETED',
        'FILE_UPLOADED',
        'FILE_DELETED',
        'INVOICE_GENERATED',
        'INVOICE_PAID',
        'INVOICE_SENT',
        'TEAM_INVITATION_SENT',
        'TEAM_MEMBER_ADDED',
        'TEAM_MEMBER_REMOVED',
        'ROLE_UPDATED',
        'CLIENT_CREATED',
        'CLIENT_UPDATED',
        'CLIENT_DELETED',
        'PASSWORD_RESET',
        'LOGIN',
        'LOGOUT',
      ],
      index: true,
      description: 'Type of action performed',
    },
    entity: {
      type: String,
      required: true,
      enum: ['PROJECT', 'TASK', 'COMMENT', 'FILE', 'INVOICE', 'TEAM', 'CLIENT', 'USER'],
      index: true,
      description: 'Type of entity being acted upon',
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      description: 'ID of the entity being acted upon',
    },
    description: {
      type: String,
      required: true,
      description: 'Human-readable description of the action',
    },
    changes: {
      type: {
        before: mongoose.Schema.Types.Mixed,
        after: mongoose.Schema.Types.Mixed,
      },
      description: 'Details of what changed (for update operations)',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      description: 'Additional context or metadata',
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: 'Project',
      description: 'Associated project ID (if applicable)',
    },
    ipAddress: {
      type: String,
      description: 'IP address from which the action was performed',
    },
    userAgent: {
      type: String,
      description: 'User agent string',
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false },
    collection: 'activityLogs',
    indexes: [
      { userId: 1, createdAt: -1 },
      { action: 1, createdAt: -1 },
      { entity: 1, entityId: 1 },
      { projectId: 1, createdAt: -1 },
      { createdAt: -1 },
    ],
  }
);

// Index for faster queries
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ projectId: 1, createdAt: -1 });
activityLogSchema.index({ entity: 1, entityId: 1, createdAt: -1 });

// Add methods
activityLogSchema.statics.logActivity = async function (activityData) {
  try {
    const log = new this(activityData);
    await log.save();
    return log;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
};

activityLogSchema.statics.findByFilters = async function (filters, page = 1, limit = 20) {
  const query = {};

  if (filters.userId) query.userId = filters.userId;
  if (filters.action) query.action = filters.action;
  if (filters.entity) query.entity = filters.entity;
  if (filters.entityId) query.entityId = filters.entityId;
  if (filters.projectId) query.projectId = filters.projectId;

  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) {
      query.createdAt.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      query.createdAt.$lte = endDate;
    }
  }

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    this.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments(query),
  ]);

  return {
    logs,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

module.exports = mongoose.model('ActivityLog', activityLogSchema);
