const User = require('../models/User');
const Lawyer = require('../models/Lawyer');
const Case = require('../models/Case');
const Payment = require('../models/Payment');
const Document = require('../models/Document');
const Admin = require('../models/Admin');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalLawyers,
      verifiedLawyers,
      pendingLawyers,
      totalCases,
      activeCases,
      completedCases,
      totalPayments,
      totalRevenue,
      monthlyRevenue,
      totalDocuments
    ] = await Promise.all([
      User.countDocuments({ role: 'user', isActive: true }),
      Lawyer.countDocuments(),
      Lawyer.countDocuments({ verificationStatus: 'verified' }),
      Lawyer.countDocuments({ verificationStatus: 'pending' }),
      Case.countDocuments({ isActive: true }),
      Case.countDocuments({ status: { $in: ['pending', 'accepted', 'in_progress'] }, isActive: true }),
      Case.countDocuments({ status: 'completed', isActive: true }),
      Payment.countDocuments({ status: 'succeeded' }),
      Payment.aggregate([
        { $match: { status: 'succeeded' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Payment.aggregate([
        { 
          $match: { 
            status: 'succeeded',
            createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Document.countDocuments({ isActive: true })
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
    const monthlyRev = monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0;

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          lawyers: totalLawyers,
          verified: verifiedLawyers,
          pending: pendingLawyers
        },
        cases: {
          total: totalCases,
          active: activeCases,
          completed: completedCases
        },
        payments: {
          total: totalPayments,
          revenue: revenue,
          monthlyRevenue: monthlyRev
        },
        documents: totalDocuments
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting dashboard statistics',
      error: error.message
    });
  }
};

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // User registrations over time
    const userRegistrations = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Case status distribution
    const caseStatusDistribution = await Case.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Revenue over time
    const revenueOverTime = await Payment.aggregate([
      { 
        $match: { 
          status: 'succeeded',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top lawyers by earnings
    const topLawyers = await Payment.aggregate([
      { $match: { status: 'succeeded' } },
      {
        $group: {
          _id: '$lawyer',
          totalEarnings: { $sum: '$lawyerAmount' },
          totalCases: { $sum: 1 }
        }
      },
      { $sort: { totalEarnings: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'lawyers',
          localField: '_id',
          foreignField: '_id',
          as: 'lawyer'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lawyer.user',
          foreignField: '_id',
          as: 'user'
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        userRegistrations,
        caseStatusDistribution,
        revenueOverTime,
        topLawyers
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting analytics data',
      error: error.message
    });
  }
};

// @desc    Get pending lawyers
// @route   GET /api/admin/lawyers/pending
// @access  Private (Admin)
exports.getPendingLawyers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const lawyers = await Lawyer.find({ verificationStatus: 'pending' })
      .populate('user', 'name email phone profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Lawyer.countDocuments({ verificationStatus: 'pending' });

    res.json({
      success: true,
      lawyers,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get pending lawyers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting pending lawyers',
      error: error.message
    });
  }
};

// @desc    Verify lawyer
// @route   PUT /api/admin/lawyers/:id/verify
// @access  Private (Admin)
exports.verifyLawyer = async (req, res) => {
  try {
    const lawyer = await Lawyer.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: 'verified' },
      { new: true }
    ).populate('user', 'name email phone');

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: 'Lawyer not found'
      });
    }

    res.json({
      success: true,
      message: 'Lawyer verified successfully',
      lawyer
    });
  } catch (error) {
    console.error('Verify lawyer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying lawyer',
      error: error.message
    });
  }
};

// @desc    Reject lawyer
// @route   PUT /api/admin/lawyers/:id/reject
// @access  Private (Admin)
exports.rejectLawyer = async (req, res) => {
  try {
    const { reason } = req.body;

    const lawyer = await Lawyer.findByIdAndUpdate(
      req.params.id,
      { 
        verificationStatus: 'rejected',
        rejectionReason: reason
      },
      { new: true }
    ).populate('user', 'name email phone');

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: 'Lawyer not found'
      });
    }

    res.json({
      success: true,
      message: 'Lawyer rejected successfully',
      lawyer
    });
  } catch (error) {
    console.error('Reject lawyer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting lawyer',
      error: error.message
    });
  }
};

// @desc    Get all lawyers
// @route   GET /api/admin/lawyers
// @access  Private (Admin)
exports.getAllLawyers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let query = {};
    if (status) {
      query.verificationStatus = status;
    }

    const lawyers = await Lawyer.find(query)
      .populate('user', 'name email phone profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Lawyer.countDocuments(query);

    res.json({
      success: true,
      lawyers,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get all lawyers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting lawyers',
      error: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const role = req.query.role;

    let query = { isActive: true };
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting users',
      error: error.message
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user details',
      error: error.message
    });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User status updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};

// @desc    Get all cases
// @route   GET /api/admin/cases
// @access  Private (Admin)
exports.getAllCases = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let query = { isActive: true };
    if (status) {
      query.status = status;
    }

    const cases = await Case.find(query)
      .populate('user', 'name email phone')
      .populate('lawyer', 'user consultationFee')
      .populate('lawyer.user', 'name email')
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
    console.error('Get all cases error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting cases',
      error: error.message
    });
  }
};

// @desc    Get case by ID
// @route   GET /api/admin/cases/:id
// @access  Private (Admin)
exports.getCaseById = async (req, res) => {
  try {
    const caseDoc = await Case.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('lawyer', 'user consultationFee')
      .populate('lawyer.user', 'name email')
      .populate('documents');

    if (!caseDoc) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
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
// @route   PUT /api/admin/cases/:id/status
// @access  Private (Admin)
exports.updateCaseStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const caseDoc = await Case.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email phone')
     .populate('lawyer', 'user consultationFee')
     .populate('lawyer.user', 'name email');

    if (!caseDoc) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

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

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Private (Admin)
exports.getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let query = {};
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate('user', 'name email phone')
      .populate('lawyer', 'user consultationFee')
      .populate('lawyer.user', 'name email')
      .populate('case', 'title status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      payments,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get all payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting payments',
      error: error.message
    });
  }
};

// @desc    Get payment by ID
// @route   GET /api/admin/payments/:id
// @access  Private (Admin)
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('lawyer', 'user consultationFee')
      .populate('lawyer.user', 'name email')
      .populate('case', 'title status');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Get payment by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting payment details',
      error: error.message
    });
  }
};

// @desc    Process refund
// @route   POST /api/admin/payments/:id/refund
// @access  Private (Admin)
exports.processRefund = async (req, res) => {
  try {
    const { amount, reason } = req.body;

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment must be successful to process refund'
      });
    }

    // Here you would integrate with Stripe to process the refund
    // For now, we'll just update the payment status

    payment.status = 'refunded';
    payment.refundAmount = amount || payment.amount;
    payment.refundReason = reason;
    payment.refundedAt = new Date();

    await payment.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      payment
    });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing refund',
      error: error.message
    });
  }
};

// @desc    Get system settings
// @route   GET /api/admin/settings
// @access  Private (Admin)
exports.getSystemSettings = async (req, res) => {
  try {
    // This would typically come from a settings collection
    const settings = {
      platformFee: 10, // 10%
      minConsultationFee: 500,
      maxConsultationFee: 50000,
      supportedLanguages: ['en', 'hi', 'bn', 'te', 'ta', 'gu', 'kn', 'ml', 'pa', 'or'],
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'],
      maintenanceMode: false,
      newUserRegistration: true,
      newLawyerRegistration: true
    };

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Get system settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting system settings',
      error: error.message
    });
  }
};

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private (Admin)
exports.updateSystemSettings = async (req, res) => {
  try {
    // This would typically update a settings collection
    const settings = req.body;

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Update system settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating system settings',
      error: error.message
    });
  }
};
