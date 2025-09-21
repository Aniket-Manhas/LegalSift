const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  fileName: {
    type: String,
    required: [true, 'File name is required']
  },
  originalName: {
    type: String,
    required: [true, 'Original file name is required']
  },
  fileType: {
    type: String,
    required: [true, 'File type is required'],
    enum: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  cloudinaryId: {
    type: String,
    required: [true, 'Cloudinary ID is required']
  },
  documentType: {
    type: String,
    required: [true, 'Document type is required'],
    enum: [
      'contract',
      'agreement',
      'lease',
      'loan_document',
      'employment_contract',
      'property_document',
      'legal_notice',
      'court_document',
      'other'
    ]
  },
  aiAnalysis: {
    isAnalyzed: {
      type: Boolean,
      default: false
    },
    analyzedAt: Date,
    riskScore: {
      type: Number,
      min: 0,
      max: 100
    },
    summary: String,
    keyTerms: [String],
    flaggedClauses: [{
      clause: String,
      riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      },
      explanation: String,
      suggestion: String
    }],
    recommendations: [String],
    plainLanguageExplanation: String,
    language: {
      type: String,
      default: 'en'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  extractedText: String,
  isEncrypted: {
    type: Boolean,
    default: true
  },
  encryptionKey: String,
  accessLevel: {
    type: String,
    enum: ['private', 'shared', 'public'],
    default: 'private'
  },
  sharedWith: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    permission: {
      type: String,
      enum: ['read', 'comment', 'edit'],
      default: 'read'
    },
    sharedAt: { type: Date, default: Date.now }
  }],
  version: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String],
  metadata: {
    author: String,
    createdDate: Date,
    modifiedDate: Date,
    pageCount: Number,
    wordCount: Number
  }
}, {
  timestamps: true
});

// Index for better search performance
documentSchema.index({ user: 1, documentType: 1 });
documentSchema.index({ 'aiAnalysis.isAnalyzed': 1 });
documentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Document', documentSchema);
