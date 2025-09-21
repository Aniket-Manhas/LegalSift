const { body, validationResult } = require('express-validator');

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
exports.validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid Indian phone number'),
  this.handleValidationErrors
];

// User login validation
exports.validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  this.handleValidationErrors
];

// Lawyer registration validation
exports.validateLawyerRegistration = [
  body('barCouncilNumber')
    .trim()
    .notEmpty()
    .withMessage('Bar Council Number is required'),
  body('barCouncilState')
    .trim()
    .notEmpty()
    .withMessage('Bar Council State is required'),
  body('yearOfEnrollment')
    .isInt({ min: 1950, max: new Date().getFullYear() })
    .withMessage('Please provide a valid year of enrollment'),
  body('specialization')
    .isArray({ min: 1 })
    .withMessage('At least one specialization is required'),
  body('experience')
    .isInt({ min: 0 })
    .withMessage('Experience must be a non-negative number'),
  body('consultationFee')
    .isFloat({ min: 0 })
    .withMessage('Consultation fee must be a non-negative number'),
  this.handleValidationErrors
];

// Case creation validation
exports.validateCaseCreation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('category')
    .isIn([
      'Criminal Law', 'Civil Law', 'Corporate Law', 'Family Law', 'Property Law',
      'Tax Law', 'Constitutional Law', 'Labour Law', 'Intellectual Property',
      'Banking Law', 'Immigration Law', 'Environmental Law', 'Consumer Law',
      'Cyber Law', 'Real Estate Law', 'Insurance Law', 'Securities Law',
      'International Law', 'Human Rights Law', 'Other'
    ])
    .withMessage('Please select a valid category'),
  body('urgency')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Urgency must be low, medium, high, or critical'),
  this.handleValidationErrors
];

// Document upload validation
exports.validateDocumentUpload = [
  body('documentType')
    .isIn([
      'contract', 'agreement', 'lease', 'loan_document', 'employment_contract',
      'property_document', 'legal_notice', 'court_document', 'other'
    ])
    .withMessage('Please select a valid document type'),
  this.handleValidationErrors
];

// Chat message validation
exports.validateChatMessage = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be between 1 and 2000 characters'),
  body('messageType')
    .optional()
    .isIn(['text', 'image', 'document', 'audio', 'video'])
    .withMessage('Invalid message type'),
  this.handleValidationErrors
];
