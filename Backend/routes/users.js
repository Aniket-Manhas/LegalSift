const express = require('express');
const { 
  getUserProfile, 
  updateUserProfile, 
  uploadProfilePicture,
  getUserDocuments,
  getUserCases,
  deleteUser,
  deactivateUser
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { upload } = require('../utils/upload');

const router = express.Router();

// All routes are protected
router.use(protect);

// User profile routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.post('/profile-picture', upload.single('profilePicture'), uploadProfilePicture);

// User data routes
router.get('/documents', getUserDocuments);
router.get('/cases', getUserCases);

// Account management
router.delete('/account', deleteUser);
router.put('/deactivate', deactivateUser);

module.exports = router;
