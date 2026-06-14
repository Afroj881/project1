const mongoose = require('mongoose');

const DeliverableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  milestone: { type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Deliverable', DeliverableSchema);
