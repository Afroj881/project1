// src/models/TeamInvitation.js
const mongoose = require('mongoose');

const teamInvitationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
      index: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    role: {
      type: String,
      default: 'team_member',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'expired'],
      default: 'pending',
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    respondedAt: Date,
    respondedBy: String,
  },
  { timestamps: true }
);

teamInvitationSchema.index({ email: 1, projectId: 1 });
teamInvitationSchema.index({ token: 1 });
teamInvitationSchema.index({ status: 1, expiresAt: 1 });

module.exports = mongoose.model('TeamInvitation', teamInvitationSchema);
