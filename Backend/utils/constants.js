// User roles
exports.USER_ROLES = {
  USER: 'user',
  LAWYER: 'lawyer',
  ADMIN: 'admin'
};

// Case statuses
exports.CASE_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Payment statuses
exports.PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

// Lawyer verification statuses
exports.LAWYER_VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
};

// Document types
exports.DOCUMENT_TYPES = {
  CONTRACT: 'contract',
  AGREEMENT: 'agreement',
  LEASE: 'lease',
  LOAN_DOCUMENT: 'loan_document',
  EMPLOYMENT_CONTRACT: 'employment_contract',
  PROPERTY_DOCUMENT: 'property_document',
  LEGAL_NOTICE: 'legal_notice',
  COURT_DOCUMENT: 'court_document',
  OTHER: 'other'
};

// Legal specializations
exports.LEGAL_SPECIALIZATIONS = [
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
];

// Supported languages
exports.SUPPORTED_LANGUAGES = {
  'en': 'English',
  'hi': 'Hindi',
  'bn': 'Bengali',
  'te': 'Telugu',
  'ta': 'Tamil',
  'gu': 'Gujarati',
  'kn': 'Kannada',
  'ml': 'Malayalam',
  'pa': 'Punjabi',
  'or': 'Odia'
};

// Risk levels
exports.RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// File upload limits
exports.FILE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'],
  MAX_FILES_PER_UPLOAD: 5
};

// Platform settings
exports.PLATFORM_SETTINGS = {
  PLATFORM_FEE_PERCENTAGE: 10,
  MIN_CONSULTATION_FEE: 500,
  MAX_CONSULTATION_FEE: 50000,
  DEFAULT_CONSULTATION_DURATION: 60, // minutes
  JWT_EXPIRE: '7d',
  PASSWORD_MIN_LENGTH: 6,
  MAX_MESSAGE_LENGTH: 2000,
  MAX_BIO_LENGTH: 500
};

// Error messages
exports.ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  SERVER_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  LAWYER_NOT_FOUND: 'Lawyer not found',
  CASE_NOT_FOUND: 'Case not found',
  PAYMENT_NOT_FOUND: 'Payment not found',
  DOCUMENT_NOT_FOUND: 'Document not found',
  INVALID_TOKEN: 'Invalid or expired token',
  ACCOUNT_DEACTIVATED: 'Account is deactivated',
  LAWYER_NOT_VERIFIED: 'Lawyer account is not verified',
  PAYMENT_ALREADY_COMPLETED: 'Payment already completed',
  CASE_ALREADY_COMPLETED: 'Case already completed',
  FEEDBACK_ALREADY_SUBMITTED: 'Feedback already submitted'
};

// Success messages
exports.SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  USER_LOGGED_IN: 'Login successful',
  USER_LOGGED_OUT: 'Logged out successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_UPDATED: 'Password updated successfully',
  LAWYER_REGISTERED: 'Lawyer profile created successfully',
  LAWYER_VERIFIED: 'Lawyer verified successfully',
  CASE_CREATED: 'Case created successfully',
  CASE_UPDATED: 'Case updated successfully',
  CASE_DELETED: 'Case deleted successfully',
  PAYMENT_CREATED: 'Payment intent created successfully',
  PAYMENT_CONFIRMED: 'Payment confirmed successfully',
  DOCUMENT_UPLOADED: 'Document uploaded successfully',
  DOCUMENT_ANALYZED: 'Document analyzed successfully',
  MESSAGE_SENT: 'Message sent successfully',
  FEEDBACK_SUBMITTED: 'Feedback submitted successfully'
};
