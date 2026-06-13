const mongoose = require('mongoose');

const timeLogSchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hours: { type: Number, required: true, min: 0 },
    note: { type: String, default: '' },
    entryDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TimeLog', timeLogSchema);
