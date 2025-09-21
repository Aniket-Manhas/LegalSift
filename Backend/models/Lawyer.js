const mongoose = require('mongoose');

const lawyerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  barCouncilNumber: {
    type: String,
    required: [true, 'Bar Council Number is required'],
    unique: true,
    trim: true
  },
  barCouncilState: {
    type: String,
    required: [true, 'Bar Council State is required']
  },
  yearOfEnrollment: {
    type: Number,
    required: [true, 'Year of enrollment is required'],
    min: [1950, 'Invalid year of enrollment'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  specialization: [{
    type: String,
    required: true,
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
  }],
  experience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Experience cannot be negative']
  },
  education: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    }
  }],
  languages: [{
    type: String,
    enum: ['en', 'hi', 'bn', 'te', 'ta', 'gu', 'kn', 'ml', 'pa', 'or']
  }],
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: [0, 'Consultation fee cannot be negative']
  },
  availability: {
    monday: { start: String, end: String, isAvailable: { type: Boolean, default: true } },
    tuesday: { start: String, end: String, isAvailable: { type: Boolean, default: true } },
    wednesday: { start: String, end: String, isAvailable: { type: Boolean, default: true } },
    thursday: { start: String, end: String, isAvailable: { type: Boolean, default: true } },
    friday: { start: String, end: String, isAvailable: { type: Boolean, default: true } },
    saturday: { start: String, end: String, isAvailable: { type: Boolean, default: true } },
    sunday: { start: String, end: String, isAvailable: { type: Boolean, default: false } }
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationDocuments: [{
    type: {
      type: String,
      enum: ['bar_certificate', 'id_proof', 'address_proof', 'education_certificate']
    },
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  casesHandled: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  achievements: [String],
  certifications: [{
    name: String,
    issuingAuthority: String,
    year: Number,
    certificateUrl: String
  }],
  consultationHistory: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
    startTime: Date,
    endTime: Date,
    amount: Number,
    status: {
      type: String,
      enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'scheduled'
    }
  }],
  earnings: {
    total: { type: Number, default: 0 },
    thisMonth: { type: Number, default: 0 },
    lastPayout: Date
  }
}, {
  timestamps: true
});

// Update rating when new review is added
lawyerSchema.methods.updateRating = function() {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = totalRating / this.reviews.length;
    this.rating.count = this.reviews.length;
  }
};

module.exports = mongoose.model('Lawyer', lawyerSchema);
