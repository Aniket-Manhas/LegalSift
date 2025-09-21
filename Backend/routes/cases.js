const express = require('express');
const { 
  createCase,
  getCases,
  getCaseById,
  updateCaseStatus,
  sendMessage,
  getCaseMessages,
  submitFeedback,
  getCaseFeedback,
  deleteCase
} = require('../controllers/caseController');
const { protect, verifyLawyer } = require('../middleware/auth');
const { validateCaseCreation, validateChatMessage } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Case routes
router.post('/', validateCaseCreation, createCase);
router.get('/', getCases);
router.get('/:id', getCaseById);
router.put('/:id/status', updateCaseStatus);
router.post('/:id/messages', validateChatMessage, sendMessage);
router.get('/:id/messages', getCaseMessages);
router.post('/:id/feedback', submitFeedback);
router.get('/:id/feedback', getCaseFeedback);
router.delete('/:id', deleteCase);

module.exports = router;
