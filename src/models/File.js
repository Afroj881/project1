const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  fileType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cloudinaryUrl: { type: String, required: true },
  cloudinaryPublicId: { type: String, required: true },
  relatedEntityType: { type: String, required: true, trim: true },
  relatedEntityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  uploadTimestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);
