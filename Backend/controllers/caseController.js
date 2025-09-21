const Case = require('../models/Case');
const Lawyer = require('../models/Lawyer');
const User = require('../models/User');
const Payment = require('../models/Payment');

// @desc    Create case
// @route   POST /api/cases
// @access  Private
exports.createCase = async (req, res) => {
  try {
    const {
      lawyerId,
      title,
      description,
      category,
      urgency = 'medium',
      consultationFee,
      scheduledDate,
      duration = 60
    } = req.body;

    // Verify lawyer exists and is verified
    const lawyer = await Lawyer.findOne({
      _id: lawyerId,
      verificationStatus: 'verified',
      isAvailable: true
    });

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: 'Lawyer not found or not available'
      });
    }

    // Create case
    const caseDoc = await Case.create({
      user: req.user._id,
      lawyer: lawyerId,
      title,
      description,
      category,
      urgency,
      consultationFee: consultationFee || lawyer.consultationFee,
      scheduledDate,
      duration
    });

    // Populate the case with lawyer details
    await caseDoc.populate('lawyer', 'user consultationFee specialization');
    await caseDoc.populate('lawyer.user', 'name email profilePicture');

    res.status(201).json({
      success: true,
      message: 'Case created successfully. Waiting for lawyer approval.',
      case: caseDoc
    });
  } catch (error) {
    console.error('Create case error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating case',
      error: error.message
    });
  }
};

// @desc    Get cases
// @route   GET /api/cases
// @access  Private
exports.getCases = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const role = req.user.role;

    let query = { isActive: true };

    if (role === 'user') {
      query.user = req.user._id;
    } else if (role === 'lawyer') {
      const lawyer = await Lawyer.findOne({ user: req.user._id });
      if (lawyer) {
        query.lawyer = lawyer._id;
      } else {
        return res.status(403).json({
          success: false,
          message: 'Lawyer profile not found'
        });
      }
    }

    if (status) {
      query.status = status;
    }

    const cases = await Case.find(query)
      .populate('user', 'name email phone profilePicture')
      .populate('lawyer', 'user consultationFee specialization')
      .populate('lawyer.user', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Case.countDocuments(query);

    res.json({
      success: true,
      cases,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get cases error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting cases',
      error: error.message
    });
  }
};

// @desc    Get case by ID
// @route   GET /api/cases/:id
// @access  Private
exports.getCaseById = async (req, res) => {
  try {
    const caseDoc = await Case.findById(req.params.id)
      .populate('user', 'name email phone profilePicture')
      .populate('lawyer', 'user consultationFee specialization')
      .populate('lawyer.user', 'name email profilePicture')
      .populate('documents');

    if (!caseDoc) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    // Check access permissions
    const hasAccess = 
      caseDoc.user._id.toString() === req.user._id.toString() ||
      (req.user.role === 'lawyer' && caseDoc.lawyer._id.toString() === req.user.lawyer?._id?.toString()) ||
      req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to case'
      });
    }

    res.json({
      success: true,
      case: caseDoc
    });
  } catch (error) {
    console.error('Get case by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting case details',
      error: error.message
    });
  }
};

// @desc    Update case status
// @route   PUT /api/cases/:id/status
// @access  Private
exports.updateCaseStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const caseId = req.params.id;

    const caseDoc = await Case.findById(caseId);

    if (!caseDoc) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    // Check permissions
    const isLawyer = req.user.role === 'lawyer' && 
      caseDoc.lawyer.toString() === req.user.lawyer?._id?.toString();
    const isUser = caseDoc.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isLawyer && !isUser && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update case status'
      });
    }

    // Validate status transition
    const validTransitions = {
      'pending': ['accepted', 'rejected'],
      'accepted': ['in_progress', 'cancelled'],
      'in_progress': ['completed', 'cancelled'],
      'rejected': [],
      'completed': [],
      'cancelled': []
    };

    if (!validTransitions[caseDoc.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${caseDoc.status} to ${status}`
      });
    }

    // Update case status
    caseDoc.status = status;
    
    if (status === 'completed') {
      caseDoc.resolution.completedAt = new Date();
    }

    await caseDoc.save();

    res.json({
      success: true,
      message: 'Case status updated successfully',
      case: caseDoc
    });
  } catch (error) {
    console.error('Update case status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating case status',
      error: error.message
    });
  }
};

// @desc    Send message in case
// @route   POST /api/cases/:id/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { content, messageType = 'text', attachments = [] } = req.body;
    const caseId = req.params.id;

    const caseDoc = await Case.findById(caseId);

    if (!caseDoc) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    // Check access permissions
    const hasAccess = 
      caseDoc.user.toString() === req.user._id.toString() ||
      (req.user.role === 'lawyer' && caseDoc.lawyer.toString() === req.user.lawyer?._id?.toString()) ||
      req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to send message'
      });
    }

    // Determine sender role
    let senderRole = 'user';
    if (req.user.role === 'lawyer' && caseDoc.lawyer.toString() === req.user.lawyer?._id?.toString()) {
      senderRole = 'lawyer';
    }

    // Add message to case
    const message = {
      sender: senderRole,
      content,
      messageType,
      attachments,
      timestamp: new Date()
    };

    caseDoc.messages.push(message);
    await caseDoc.save();

    res.json({
      success: true,
      message: 'Message sent successfully',
      newMessage: message
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

// @desc    Get case messages
// @route   GET /api/cases/:id/messages
// @access  Private
exports.getCaseMessages = async (req, res) => {
  try {
    const caseId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const caseDoc = await Case.findById(caseId);

    if (!caseDoc) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    // Check access permissions
    const hasAccess = 
      caseDoc.user.toString() === req.user._id.toString() ||
      (req.user.role === 'lawyer' && caseDoc.lawyer.toString() === req.user.lawyer?._id?.toString()) ||
      req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view messages'
      });
    }

    // Get messages with pagination
    const messages = caseDoc.messages
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .slice(skip, skip + limit);

    res.json({
      success: true,
      messages,
      pagination: {
        current: page,
        pages: Math.ceil(caseDoc.messages.length / limit),
        total: caseDoc.messages.length
      }
    });
  } catch (error) {
    console.error('Get case messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting messages',
      error: error.message
    });
  }
};

// @desc    Submit feedback
// @route   POST /api/cases/:id/feedback
// @access  Private
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const caseId = req.params.id;

    const caseDoc = await Case.findById(caseId);

    if (!caseDoc) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    // Check if user has access and case is completed
    if (caseDoc.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to submit feedback'
      });
    }

    if (caseDoc.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only submit feedback for completed cases'
      });
    }

    if (caseDoc.feedback.rating) {
      return res.status(400).json({
        success: false,
        message: 'Feedback already submitted for this case'
      });
    }

    // Update case with feedback
    caseDoc.feedback = {
      rating,
      comment,
      submittedAt: new Date()
    };

    await caseDoc.save();

    // Update lawyer rating
    const lawyer = await Lawyer.findById(caseDoc.lawyer);
    if (lawyer) {
      lawyer.reviews.push({
        user: req.user._id,
        rating,
        comment,
        createdAt: new Date()
      });
      lawyer.updateRating();
      await lawyer.save();
    }

    res.json({
      success: true,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      error: error.message
    });
  }
};

// @desc    Get case feedback
// @route   GET /api/cases/:id/feedback
// @access  Private
exports.getCaseFeedback = async (req, res) => {
  try {
    const caseId = req.params.id;

    const caseDoc = await Case.findById(caseId);

    if (!caseDoc) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    // Check access permissions
    const hasAccess = 
      caseDoc.user.toString() === req.user._id.toString() ||
      (req.user.role === 'lawyer' && caseDoc.lawyer.toString() === req.user.lawyer?._id?.toString()) ||
      req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view feedback'
      });
    }

    res.json({
      success: true,
      feedback: caseDoc.feedback
    });
  } catch (error) {
    console.error('Get case feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting feedback',
      error: error.message
    });
  }
};

// @desc    Delete case
// @route   DELETE /api/cases/:id
// @access  Private
exports.deleteCase = async (req, res) => {
  try {
    const caseId = req.params.id;

    const caseDoc = await Case.findById(caseId);

    if (!caseDoc) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    // Check permissions
    const isUser = caseDoc.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isUser && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete case'
      });
    }

    // Soft delete
    caseDoc.isActive = false;
    await caseDoc.save();

    res.json({
      success: true,
      message: 'Case deleted successfully'
    });
  } catch (error) {
    console.error('Delete case error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting case',
      error: error.message
    });
  }
};
