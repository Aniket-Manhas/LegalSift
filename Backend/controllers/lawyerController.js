const Lawyer = require('../models/Lawyer');
const User = require('../models/User');
const Case = require('../models/Case');
const Payment = require('../models/Payment');
const cloudinary = require('cloudinary').v2;

// @desc    Register lawyer
// @route   POST /api/lawyers/register
// @access  Private
exports.registerLawyer = async (req, res) => {
  try {
    const {
      barCouncilNumber,
      barCouncilState,
      yearOfEnrollment,
      specialization,
      experience,
      consultationFee,
      education,
      languages,
      bio,
      achievements,
      certifications
    } = req.body;

    // Check if lawyer already exists
    const existingLawyer = await Lawyer.findOne({ 
      $or: [
        { barCouncilNumber },
        { user: req.user._id }
      ]
    });

    if (existingLawyer) {
      return res.status(400).json({
        success: false,
        message: 'Lawyer profile already exists or Bar Council Number already registered'
      });
    }

    // Create lawyer profile
    const lawyer = await Lawyer.create({
      user: req.user._id,
      barCouncilNumber,
      barCouncilState,
      yearOfEnrollment,
      specialization,
      experience,
      consultationFee,
      education: education || [],
      languages: languages || ['en'],
      bio,
      achievements: achievements || [],
      certifications: certifications || []
    });

    // Update user role
    await User.findByIdAndUpdate(req.user._id, { role: 'lawyer' });

    res.status(201).json({
      success: true,
      message: 'Lawyer profile created successfully. Please upload verification documents.',
      lawyer
    });
  } catch (error) {
    console.error('Lawyer registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating lawyer profile',
      error: error.message
    });
  }
};

// @desc    Get lawyer profile
// @route   GET /api/lawyers/profile/me
// @access  Private (Lawyer)
exports.getLawyerProfile = async (req, res) => {
  try {
    const lawyer = await Lawyer.findOne({ user: req.user._id })
      .populate('user', 'name email phone profilePicture');

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: 'Lawyer profile not found'
      });
    }

    res.json({
      success: true,
      lawyer
    });
  } catch (error) {
    console.error('Get lawyer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting lawyer profile',
      error: error.message
    });
  }
};

// @desc    Update lawyer profile
// @route   PUT /api/lawyers/profile/me
// @access  Private (Lawyer)
exports.updateLawyerProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      specialization: req.body.specialization,
      experience: req.body.experience,
      consultationFee: req.body.consultationFee,
      education: req.body.education,
      languages: req.body.languages,
      bio: req.body.bio,
      achievements: req.body.achievements,
      certifications: req.body.certifications
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const lawyer = await Lawyer.findOneAndUpdate(
      { user: req.user._id },
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).populate('user', 'name email phone profilePicture');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      lawyer
    });
  } catch (error) {
    console.error('Update lawyer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// @desc    Upload verification documents
// @route   POST /api/lawyers/verification-documents
// @access  Private (Lawyer)
exports.uploadVerificationDocuments = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one document'
      });
    }

    const documents = [];
    
    for (let file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'legalsift/verification-documents',
        resource_type: 'auto'
      });

      documents.push({
        type: file.fieldname,
        url: result.secure_url,
        uploadedAt: new Date()
      });
    }

    const lawyer = await Lawyer.findOneAndUpdate(
      { user: req.user._id },
      { 
        verificationDocuments: documents,
        verificationStatus: 'pending'
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Documents uploaded successfully. Verification is pending.',
      lawyer
    });
  } catch (error) {
    console.error('Upload verification documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading documents',
      error: error.message
    });
  }
};

// @desc    Get lawyer cases
// @route   GET /api/lawyers/cases/me
// @access  Private (Lawyer)
exports.getLawyerCases = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const query = { lawyer: req.lawyer._id, isActive: true };
    if (status) {
      query.status = status;
    }

    const cases = await Case.find(query)
      .populate('user', 'name email phone')
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
    console.error('Get lawyer cases error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting cases',
      error: error.message
    });
  }
};

// @desc    Get lawyer earnings
// @route   GET /api/lawyers/earnings/me
// @access  Private (Lawyer)
exports.getLawyerEarnings = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let startDate, endDate;
    const now = new Date();
    
    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }
    
    endDate = new Date();

    const payments = await Payment.find({
      lawyer: req.lawyer._id,
      status: 'succeeded',
      createdAt: { $gte: startDate, $lte: endDate }
    });

    const totalEarnings = payments.reduce((sum, payment) => sum + payment.lawyerAmount, 0);
    const totalConsultations = payments.length;

    res.json({
      success: true,
      earnings: {
        total: totalEarnings,
        thisMonth: totalEarnings,
        consultations: totalConsultations,
        period,
        startDate,
        endDate
      }
    });
  } catch (error) {
    console.error('Get lawyer earnings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting earnings',
      error: error.message
    });
  }
};

// @desc    Update availability
// @route   PUT /api/lawyers/availability/me
// @access  Private (Lawyer)
exports.updateAvailability = async (req, res) => {
  try {
    const { availability, isAvailable } = req.body;

    const updateData = {};
    if (availability) updateData.availability = availability;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;

    const lawyer = await Lawyer.findOneAndUpdate(
      { user: req.user._id },
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: 'Availability updated successfully',
      lawyer
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating availability',
      error: error.message
    });
  }
};

// @desc    Get lawyer reviews
// @route   GET /api/lawyers/reviews/me
// @access  Private (Lawyer)
exports.getLawyerReviews = async (req, res) => {
  try {
    const lawyer = await Lawyer.findOne({ user: req.user._id })
      .populate('reviews.user', 'name profilePicture');

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: 'Lawyer profile not found'
      });
    }

    res.json({
      success: true,
      reviews: lawyer.reviews,
      rating: lawyer.rating
    });
  } catch (error) {
    console.error('Get lawyer reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting reviews',
      error: error.message
    });
  }
};

// @desc    Search lawyers
// @route   GET /api/lawyers/search
// @access  Public
exports.searchLawyers = async (req, res) => {
  try {
    const {
      specialization,
      location,
      minFee,
      maxFee,
      rating,
      experience,
      language,
      page = 1,
      limit = 10
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = { 
      verificationStatus: 'verified',
      isAvailable: true 
    };

    // Build query based on filters
    if (specialization) {
      query.specialization = { $in: specialization.split(',') };
    }
    
    if (minFee || maxFee) {
      query.consultationFee = {};
      if (minFee) query.consultationFee.$gte = parseInt(minFee);
      if (maxFee) query.consultationFee.$lte = parseInt(maxFee);
    }
    
    if (rating) {
      query['rating.average'] = { $gte: parseInt(rating) };
    }
    
    if (experience) {
      query.experience = { $gte: parseInt(experience) };
    }
    
    if (language) {
      query.languages = { $in: language.split(',') };
    }

    const lawyers = await Lawyer.find(query)
      .populate('user', 'name email profilePicture location')
      .sort({ 'rating.average': -1, 'rating.count': -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Lawyer.countDocuments(query);

    res.json({
      success: true,
      lawyers,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Search lawyers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching lawyers',
      error: error.message
    });
  }
};

// @desc    Get lawyer by ID
// @route   GET /api/lawyers/:id
// @access  Public
exports.getLawyerById = async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id)
      .populate('user', 'name email profilePicture location')
      .populate('reviews.user', 'name profilePicture');

    if (!lawyer || lawyer.verificationStatus !== 'verified') {
      return res.status(404).json({
        success: false,
        message: 'Lawyer not found'
      });
    }

    res.json({
      success: true,
      lawyer
    });
  } catch (error) {
    console.error('Get lawyer by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting lawyer details',
      error: error.message
    });
  }
};
