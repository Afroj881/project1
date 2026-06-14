const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  number: { type: String, required: true },
  status: { type: String, enum: ['paid','pending','overdue'], default: 'pending' },
  dueDate: { type: Date },
  total: { type: Number, required: true },
  files: [{ name: String, url: String }],
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
