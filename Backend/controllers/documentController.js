const Document = require('../models/Document');
const Case = require('../models/Case');
const { extractTextFromDocument, analyzeDocument, translateText } = require('../services/aiService');
const cloudinary = require('cloudinary').v2;
const crypto = require('crypto');

// @desc    Upload document
// @route   POST /api/documents/upload
// @access  Private
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const { documentType, caseId, tags = [] } = req.body;

    // Extract text from document
    let extractedText = '';
    try {
      extractedText = await extractTextFromDocument(
        req.file.buffer,
        req.file.mimetype.split('/')[1]
      );
    } catch (error) {
      console.error('Text extraction failed:', error);
      // Continue with upload even if text extraction fails
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'legalsift/documents',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Generate encryption key
    const encryptionKey = crypto.randomBytes(32).toString('hex');

    // Create document record
    const document = await Document.create({
      user: req.user._id,
      case: caseId || null,
      fileName: req.file.originalname,
      originalName: req.file.originalname,
      fileType: req.file.mimetype.split('/')[1],
      fileSize: req.file.size,
      fileUrl: result.secure_url,
      cloudinaryId: result.public_id,
      documentType,
      extractedText,
      encryptionKey,
      tags
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading document',
      error: error.message
    });
  }
};

// @desc    Get user documents
// @route   GET /api/documents
// @access  Private
exports.getDocuments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const documentType = req.query.documentType;
    const caseId = req.query.caseId;

    let query = { user: req.user._id, isActive: true };
    
    if (documentType) {
      query.documentType = documentType;
    }
    
    if (caseId) {
      query.case = caseId;
    }

    const documents = await Document.find(query)
      .populate('case', 'title status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Document.countDocuments(query);

    res.json({
      success: true,
      documents,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting documents',
      error: error.message
    });
  }
};

// @desc    Get document by ID
// @route   GET /api/documents/:id
// @access  Private
exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    }).populate('case', 'title status');

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      document
    });
  } catch (error) {
    console.error('Get document by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting document',
      error: error.message
    });
  }
};

// @desc    Analyze document
// @route   POST /api/documents/:id/analyze
// @access  Private
exports.analyzeDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    if (!document.extractedText) {
      return res.status(400).json({
        success: false,
        message: 'Document text not available for analysis'
      });
    }

    // Perform AI analysis
    const analysis = await analyzeDocument(
      document.extractedText,
      document.documentType,
      req.user.preferences?.language || 'en'
    );

    // Update document with analysis results
    document.aiAnalysis = {
      isAnalyzed: true,
      analyzedAt: new Date(),
      ...analysis
    };

    await document.save();

    res.json({
      success: true,
      message: 'Document analyzed successfully',
      analysis: document.aiAnalysis
    });
  } catch (error) {
    console.error('Analyze document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing document',
      error: error.message
    });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(document.cloudinaryId);
    } catch (cloudinaryError) {
      console.error('Cloudinary deletion error:', cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
    }

    // Soft delete from database
    document.isActive = false;
    await document.save();

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting document',
      error: error.message
    });
  }
};

// @desc    Share document
// @route   POST /api/documents/:id/share
// @access  Private
exports.shareDocument = async (req, res) => {
  try {
    const { userId, permission = 'read' } = req.body;

    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check if already shared with this user
    const existingShare = document.sharedWith.find(
      share => share.user.toString() === userId
    );

    if (existingShare) {
      existingShare.permission = permission;
    } else {
      document.sharedWith.push({
        user: userId,
        permission,
        sharedAt: new Date()
      });
    }

    await document.save();

    res.json({
      success: true,
      message: 'Document shared successfully'
    });
  } catch (error) {
    console.error('Share document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sharing document',
      error: error.message
    });
  }
};

// @desc    Get document analysis
// @route   GET /api/documents/:id/analysis
// @access  Private
exports.getDocumentAnalysis = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    if (!document.aiAnalysis.isAnalyzed) {
      return res.status(400).json({
        success: false,
        message: 'Document has not been analyzed yet'
      });
    }

    res.json({
      success: true,
      analysis: document.aiAnalysis
    });
  } catch (error) {
    console.error('Get document analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting document analysis',
      error: error.message
    });
  }
};

// @desc    Translate document
// @route   POST /api/documents/:id/translate
// @access  Private
exports.translateDocument = async (req, res) => {
  try {
    const { targetLanguage } = req.body;

    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    if (!document.extractedText) {
      return res.status(400).json({
        success: false,
        message: 'Document text not available for translation'
      });
    }

    // Translate the document text
    const translatedText = await translateText(
      document.extractedText,
      targetLanguage
    );

    res.json({
      success: true,
      translatedText,
      originalLanguage: 'en', // Assuming original is English
      targetLanguage
    });
  } catch (error) {
    console.error('Translate document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error translating document',
      error: error.message
    });
  }
};
