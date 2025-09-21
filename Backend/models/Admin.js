const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adminLevel: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator'],
    default: 'admin'
  },
  permissions: {
    userManagement: { type: Boolean, default: true },
    lawyerVerification: { type: Boolean, default: true },
    caseManagement: { type: Boolean, default: true },
    paymentManagement: { type: Boolean, default: true },
    contentModeration: { type: Boolean, default: true },
    analytics: { type: Boolean, default: true },
    systemSettings: { type: Boolean, default: false }
  },
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Admin', adminSchema);
