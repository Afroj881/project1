const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  milestone: { type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' },
  deliverable: { type: mongoose.Schema.Types.ObjectId, ref: 'Deliverable' },
  type: { type: String, enum: ['comment','approval','revision','suggestion'], default: 'comment' },
  message: { type: String },
  metadata: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);
