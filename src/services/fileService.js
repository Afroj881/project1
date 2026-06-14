const cloudinary = require('../config/cloudinaryConfig');
const File = require('../models/File');

const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
    stream.end(fileBuffer);
  });
};

const createFileRecord = async ({ uploadResult, file, userId, relatedEntityType, relatedEntityId }) => {
  return File.create({
    filename: uploadResult.original_filename || file.originalname,
    originalName: file.originalname,
    fileType: file.mimetype,
    size: file.size,
    uploadedBy: userId,
    cloudinaryUrl: uploadResult.secure_url,
    cloudinaryPublicId: uploadResult.public_id,
    relatedEntityType: relatedEntityType.toLowerCase(),
    relatedEntityId,
  });
};

const deleteCloudinaryAsset = async (publicId) => {
  return cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
};

const getProjectFiles = async (projectId) => {
  return File.find({ relatedEntityType: 'project', relatedEntityId: projectId })
    .populate('uploadedBy', 'name email role')
    .sort({ createdAt: -1 });
};

module.exports = { uploadToCloudinary, createFileRecord, deleteCloudinaryAsset, getProjectFiles };
