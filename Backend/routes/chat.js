const express = require('express');
const { 
  sendMessage,
  getChatHistory,
  getChatById,
  deleteChat,
  generateVoiceSummary
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const { validateChatMessage } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Chat routes
router.post('/send', validateChatMessage, sendMessage);
router.get('/history', getChatHistory);
router.get('/:id', getChatById);
router.delete('/:id', deleteChat);
router.post('/voice-summary', generateVoiceSummary);

module.exports = router;
