const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String },
  meta: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
