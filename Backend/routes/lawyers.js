const express = require('express');
const { 
  registerLawyer,
  getLawyerProfile,
  updateLawyerProfile,
  uploadVerificationDocuments,
  getLawyerCases,
  getLawyerEarnings,
  updateAvailability,
  getLawyerReviews,
  searchLawyers,
  getLawyerById
} = require('../controllers/lawyerController');
const { protect, verifyLawyer } = require('../middleware/auth');
const { validateLawyerRegistration } = require('../middleware/validation');
const { upload } = require('../utils/upload');

const router = express.Router();

// Public routes
router.get('/search', searchLawyers);
router.get('/:id', getLawyerById);

// Protected routes
router.use(protect);

// Lawyer registration and profile management
router.post('/register', validateLawyerRegistration, registerLawyer);
router.get('/profile/me', verifyLawyer, getLawyerProfile);
router.put('/profile/me', verifyLawyer, updateLawyerProfile);
router.post('/verification-documents', verifyLawyer, upload.array('documents', 5), uploadVerificationDocuments);

// Lawyer dashboard routes
router.get('/cases/me', verifyLawyer, getLawyerCases);
router.get('/earnings/me', verifyLawyer, getLawyerEarnings);
router.put('/availability/me', verifyLawyer, updateAvailability);
router.get('/reviews/me', verifyLawyer, getLawyerReviews);

module.exports = router;
