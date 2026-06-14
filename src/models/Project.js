const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active','paused','completed','archived'], default: 'active' },
  milestones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' }],
  deliverables: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Deliverable' }],
  assignedTeam: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  updates: [{
    title: String,
    body: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
