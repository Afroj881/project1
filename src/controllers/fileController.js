const { uploadToCloudinary, createFileRecord, deleteCloudinaryAsset, getProjectFiles } = require('../services/fileService');
const { logActivity } = require('../services/activityService');
const { createNotification } = require('../services/notificationService');

const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File is required' });
  }

  const { relatedEntityType, relatedEntityId } = req.body;
  if (!relatedEntityType || !relatedEntityId) {
    return res.status(400).json({ message: 'relatedEntityType and relatedEntityId are required' });
  }

  const uploadResult = await uploadToCloudinary(req.file.buffer);
  const fileRecord = await createFileRecord({
    uploadResult,
    file: req.file,
    userId: req.user._id,
    relatedEntityType,
    relatedEntityId,
  });

  await logActivity({
    user_id: req.user._id,
    action: 'upload_file',
    entityType: relatedEntityType,
    entityId: relatedEntityId,
    details: { fileId: fileRecord._id, filename: fileRecord.originalName },
  });

  await createNotification({
    user_id: req.user._id,
    type: 'file_upload',
    message: `File uploaded: ${fileRecord.originalName}`,
    link: `/files/${fileRecord._id}`,
  });

  res.status(201).json({ file: fileRecord });
};

const getFilesByProject = async (req, res) => {
  const projectId = req.params.id;
  const files = await getProjectFiles(projectId);
  res.json({ count: files.length, files });
};

const deleteFile = async (req, res) => {
  const fileId = req.params.id;
  const File = require('../models/File');
  const file = await File.findById(fileId);
  if (!file) {
    return res.status(404).json({ message: 'File not found' });
  }

  const ownerId = file.uploadedBy.toString();
  const allowedRoles = ['admin', 'manager'];
  if (req.user._id.toString() !== ownerId && !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: cannot delete this file' });
  }

  await deleteCloudinaryAsset(file.cloudinaryPublicId);
  await file.deleteOne();

  await logActivity({
    user_id: req.user._id,
    action: 'delete_file',
    entityType: file.relatedEntityType,
    entityId: file.relatedEntityId,
    details: { fileId: file._id, filename: file.originalName },
  });

  res.json({ message: 'File deleted successfully' });
};

module.exports = { uploadFile, getFilesByProject, deleteFile };
