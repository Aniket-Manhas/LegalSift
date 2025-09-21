const crypto = require('crypto');

// @desc    Generate random string
// @param   {number} length - Length of string
// @returns {string} Random string
exports.generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// @desc    Generate verification token
// @returns {string} Verification token
exports.generateVerificationToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// @desc    Generate reset token
// @returns {string} Reset token
exports.generateResetToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// @desc    Hash token
// @param   {string} token - Token to hash
// @returns {string} Hashed token
exports.hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// @desc    Format currency
// @param   {number} amount - Amount to format
// @param   {string} currency - Currency code
// @returns {string} Formatted currency
exports.formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// @desc    Format date
// @param   {Date} date - Date to format
// @param   {string} locale - Locale code
// @returns {string} Formatted date
exports.formatDate = (date, locale = 'en-IN') => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

// @desc    Calculate platform fee
// @param   {number} amount - Total amount
// @param   {number} percentage - Fee percentage
// @returns {Object} Fee breakdown
exports.calculatePlatformFee = (amount, percentage = 10) => {
  const platformFee = Math.round((amount * percentage) / 100);
  const lawyerAmount = amount - platformFee;
  
  return {
    total: amount,
    platformFee,
    lawyerAmount,
    percentage
  };
};

// @desc    Validate email
// @param   {string} email - Email to validate
// @returns {boolean} Is valid email
exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// @desc    Validate Indian phone number
// @param   {string} phone - Phone number to validate
// @returns {boolean} Is valid phone
exports.isValidIndianPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// @desc    Generate case reference number
// @returns {string} Case reference
exports.generateCaseReference = () => {
  const prefix = 'LS';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// @desc    Generate payment reference
// @returns {string} Payment reference
exports.generatePaymentReference = () => {
  const prefix = 'PAY';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// @desc    Calculate risk score color
// @param   {number} score - Risk score (0-100)
// @returns {string} Color code
exports.getRiskScoreColor = (score) => {
  if (score >= 80) return '#dc3545'; // Red - Critical
  if (score >= 60) return '#fd7e14'; // Orange - High
  if (score >= 40) return '#ffc107'; // Yellow - Medium
  return '#28a745'; // Green - Low
};

// @desc    Get risk level from score
// @param   {number} score - Risk score (0-100)
// @returns {string} Risk level
exports.getRiskLevel = (score) => {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
};

// @desc    Sanitize text
// @param   {string} text - Text to sanitize
// @returns {string} Sanitized text
exports.sanitizeText = (text) => {
  return text
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: links
    .trim();
};

// @desc    Truncate text
// @param   {string} text - Text to truncate
// @param   {number} length - Maximum length
// @returns {string} Truncated text
exports.truncateText = (text, length = 100) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// @desc    Generate pagination info
// @param   {number} page - Current page
// @param   {number} limit - Items per page
// @param   {number} total - Total items
// @returns {Object} Pagination info
exports.generatePagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  return {
    current: page,
    pages: totalPages,
    total,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null
  };
};

// @desc    Calculate distance between two coordinates
// @param   {Object} coord1 - First coordinate {lat, lng}
// @param   {Object} coord2 - Second coordinate {lat, lng}
// @returns {number} Distance in kilometers
exports.calculateDistance = (coord1, coord2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// @desc    Generate file hash
// @param   {Buffer} buffer - File buffer
// @returns {string} File hash
exports.generateFileHash = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

// @desc    Check if file type is allowed
// @param   {string} mimeType - MIME type
// @returns {boolean} Is allowed
exports.isAllowedFileType = (mimeType) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];
  return allowedTypes.includes(mimeType);
};

// @desc    Get file extension from MIME type
// @param   {string} mimeType - MIME type
// @returns {string} File extension
exports.getFileExtension = (mimeType) => {
  const mimeToExt = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'text/plain': 'txt',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png'
  };
  return mimeToExt[mimeType] || 'unknown';
};
