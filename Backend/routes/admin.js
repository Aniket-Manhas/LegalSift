const express = require('express');
const { 
  getDashboardStats,
  getPendingLawyers,
  verifyLawyer,
  rejectLawyer,
  getAllUsers,
  getAllLawyers,
  getAllCases,
  getAllPayments,
  getUserById,
  updateUserStatus,
  getCaseById,
  updateCaseStatus,
  getPaymentById,
  processRefund,
  getSystemSettings,
  updateSystemSettings,
  getAnalytics
} = require('../controllers/adminController');
const { protect, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and require admin access
router.use(protect);
router.use(verifyAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);

// Lawyer management
router.get('/lawyers/pending', getPendingLawyers);
router.put('/lawyers/:id/verify', verifyLawyer);
router.put('/lawyers/:id/reject', rejectLawyer);
router.get('/lawyers', getAllLawyers);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/status', updateUserStatus);

// Case management
router.get('/cases', getAllCases);
router.get('/cases/:id', getCaseById);
router.put('/cases/:id/status', updateCaseStatus);

// Payment management
router.get('/payments', getAllPayments);
router.get('/payments/:id', getPaymentById);
router.post('/payments/:id/refund', processRefund);

// System settings
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);

module.exports = router;
