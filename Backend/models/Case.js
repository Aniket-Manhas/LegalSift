const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lawyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lawyer',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Case title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Case description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Case category is required'],
    enum: [
      'Criminal Law',
      'Civil Law',
      'Corporate Law',
      'Family Law',
      'Property Law',
      'Tax Law',
      'Constitutional Law',
      'Labour Law',
      'Intellectual Property',
      'Banking Law',
      'Immigration Law',
      'Environmental Law',
      'Consumer Law',
      'Cyber Law',
      'Real Estate Law',
      'Insurance Law',
      'Securities Law',
      'International Law',
      'Human Rights Law',
      'Other'
    ]
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  messages: [{
    sender: {
      type: String,
      enum: ['user', 'lawyer'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: [0, 'Fee cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentId: String,
  scheduledDate: Date,
  duration: {
    type: Number, // in minutes
    default: 60
  },
  aiAnalysis: {
    riskScore: {
      type: Number,
      min: 0,
      max: 100
    },
    keyPoints: [String],
    recommendations: [String],
    flaggedClauses: [{
      clause: String,
      riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      },
      explanation: String
    }]
  },
  resolution: {
    summary: String,
    outcome: String,
    documents: [String],
    completedAt: Date
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Case', caseSchema);
