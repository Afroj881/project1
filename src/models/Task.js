const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    milestone: { type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    status: {
      type: String,
      enum: ['backlog', 'in_progress', 'review', 'blocked', 'completed', 'cancelled'],
      default: 'backlog',
    },
    dueDate: { type: Date },
    estimatedHours: { type: Number, default: 0, min: 0 },
    actualHours: { type: Number, default: 0, min: 0 },
    parentTask: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

taskSchema.virtual('subtasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'parentTask',
});

taskSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'task',
});

taskSchema.virtual('attachments', {
  ref: 'Attachment',
  localField: '_id',
  foreignField: 'task',
});

taskSchema.virtual('activityLogs', {
  ref: 'ActivityLog',
  localField: '_id',
  foreignField: 'task',
});

taskSchema.virtual('timeLogs', {
  ref: 'TimeLog',
  localField: '_id',
  foreignField: 'task',
});

module.exports = mongoose.model('Task', taskSchema);
