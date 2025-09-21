const express = require('express');
const { register, login, logout, getMe, forgotPassword, resetPassword, updatePassword, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Protected routes
router.use(protect); // All routes below are protected

router.get('/me', getMe);
router.post('/logout', logout);
router.put('/update-password', updatePassword);
router.put('/update-profile', updateProfile);

module.exports = router;
