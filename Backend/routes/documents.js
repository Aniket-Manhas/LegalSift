const express = require('express');
const { 
  uploadDocument,
  getDocuments,
  getDocumentById,
  analyzeDocument,
  deleteDocument,
  shareDocument,
  getDocumentAnalysis,
  translateDocument
} = require('../controllers/documentController');
const { protect } = require('../middleware/auth');
const { validateDocumentUpload } = require('../middleware/validation');
const { upload } = require('../utils/upload');

const router = express.Router();

// All routes are protected
router.use(protect);

// Document routes
router.post('/upload', upload.single('document'), validateDocumentUpload, uploadDocument);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.post('/:id/analyze', analyzeDocument);
router.delete('/:id', deleteDocument);
router.post('/:id/share', shareDocument);
router.get('/:id/analysis', getDocumentAnalysis);
router.post('/:id/translate', translateDocument);

module.exports = router;
