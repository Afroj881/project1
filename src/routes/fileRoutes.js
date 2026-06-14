const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { uploadFile, getFilesByProject, deleteFile } = require('../controllers/fileController');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/upload', authenticate, upload.single('file'), uploadFile);
router.get('/files/project/:id', authenticate, getFilesByProject);
router.delete('/files/:id', authenticate, deleteFile);

module.exports = router;
