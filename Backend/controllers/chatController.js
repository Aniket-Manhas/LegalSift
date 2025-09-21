const Chat = require('../models/Chat');
const Document = require('../models/Document');
const { generateChatResponse, generateVoiceSummary } = require('../services/aiService');

// @desc    Send message to AI
// @route   POST /api/chat/send
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { content, messageType = 'text', attachments = [], caseId } = req.body;

    // Generate AI response
    const aiResponse = await generateChatResponse(
      content,
      req.user.preferences?.language || 'en'
    );

    // Find or create chat
    let chat = await Chat.findOne({
      participants: { $elemMatch: { user: req.user._id, role: 'user' } },
      case: caseId || null
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [{ user: req.user._id, role: 'user' }],
        case: caseId || null
      });
    }

    // Add user message
    const userMessage = {
      sender: req.user._id,
      content,
      messageType,
      attachments,
      timestamp: new Date()
    };

    chat.messages.push(userMessage);

    // Add AI response
    const aiMessage = {
      sender: null, // AI doesn't have a user ID
      content: aiResponse,
      messageType: 'text',
      timestamp: new Date()
    };

    chat.messages.push(aiMessage);

    await chat.save();

    res.json({
      success: true,
      message: 'Message sent successfully',
      chat: {
        id: chat._id,
        messages: chat.messages.slice(-2) // Return last 2 messages
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

// @desc    Get chat history
// @route   GET /api/chat/history
// @access  Private
exports.getChatHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const caseId = req.query.caseId;

    let query = {
      participants: { $elemMatch: { user: req.user._id } },
      isActive: true
    };

    if (caseId) {
      query.case = caseId;
    }

    const chats = await Chat.find(query)
      .populate('participants.user', 'name profilePicture')
      .populate('case', 'title status')
      .sort({ 'lastMessage.timestamp': -1 })
      .skip(skip)
      .limit(limit);

    const total = await Chat.countDocuments(query);

    res.json({
      success: true,
      chats,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting chat history',
      error: error.message
    });
  }
};

// @desc    Get chat by ID
// @route   GET /api/chat/:id
// @access  Private
exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      participants: { $elemMatch: { user: req.user._id } }
    })
    .populate('participants.user', 'name profilePicture')
    .populate('case', 'title status');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Mark messages as read
    chat.messages.forEach(message => {
      if (message.sender && message.sender.toString() !== req.user._id.toString()) {
        message.isRead = true;
        message.readAt = new Date();
      }
    });

    await chat.save();

    res.json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Get chat by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting chat',
      error: error.message
    });
  }
};

// @desc    Delete chat
// @route   DELETE /api/chat/:id
// @access  Private
exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      participants: { $elemMatch: { user: req.user._id } }
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Soft delete
    chat.isActive = false;
    chat.isArchived = true;
    chat.archivedAt = new Date();
    await chat.save();

    res.json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting chat',
      error: error.message
    });
  }
};

// @desc    Generate voice summary
// @route   POST /api/chat/voice-summary
// @access  Private
exports.generateVoiceSummary = async (req, res) => {
  try {
    const { text, language = 'en' } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required for voice summary'
      });
    }

    const voiceSummary = await generateVoiceSummary(
      text,
      language
    );

    res.json({
      success: true,
      voiceSummary
    });
  } catch (error) {
    console.error('Generate voice summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating voice summary',
      error: error.message
    });
  }
};
