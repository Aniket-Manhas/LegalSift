const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Case = require('../models/Case');
const Lawyer = require('../models/Lawyer');
const User = require('../models/User');

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
  try {
    const { caseId, amount, currency = 'INR' } = req.body;

    // Validate case
    const caseDoc = await Case.findById(caseId)
      .populate('lawyer', 'consultationFee user')
      .populate('user', 'name email');

    if (!caseDoc) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    if (caseDoc.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to case'
      });
    }

    if (caseDoc.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed for this case'
      });
    }

    // Calculate platform fee (10%)
    const platformFeePercentage = 10;
    const platformFee = Math.round((amount * platformFeePercentage) / 100);
    const lawyerAmount = amount - platformFee;

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to paise
      currency: currency.toLowerCase(),
      metadata: {
        caseId: caseId,
        userId: req.user._id.toString(),
        lawyerId: caseDoc.lawyer._id.toString(),
        platformFee: platformFee.toString(),
        lawyerAmount: lawyerAmount.toString()
      },
      automatic_payment_methods: {
        enabled: true
      }
    });

    // Create payment record
    const payment = await Payment.create({
      user: req.user._id,
      lawyer: caseDoc.lawyer._id,
      case: caseId,
      amount,
      currency,
      stripePaymentIntentId: paymentIntent.id,
      status: 'pending',
      platformFee,
      lawyerAmount,
      paymentDetails: {
        caseTitle: caseDoc.title
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment intent',
      error: error.message
    });
  }
};

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }

    // Find payment record
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntentId
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Update payment status
    payment.status = 'succeeded';
    payment.stripeChargeId = paymentIntent.latest_charge;
    payment.processedAt = new Date();
    payment.paymentDetails = {
      ...payment.paymentDetails,
      cardLast4: paymentIntent.charges?.data[0]?.payment_method_details?.card?.last4,
      cardBrand: paymentIntent.charges?.data[0]?.payment_method_details?.card?.brand
    };

    await payment.save();

    // Update case payment status
    await Case.findByIdAndUpdate(payment.case, {
      paymentStatus: 'paid',
      paymentId: payment._id
    });

    // Update lawyer earnings
    const lawyer = await Lawyer.findById(payment.lawyer);
    if (lawyer) {
      lawyer.earnings.total += payment.lawyerAmount;
      lawyer.earnings.thisMonth += payment.lawyerAmount;
      await lawyer.save();
    }

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      payment
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming payment',
      error: error.message
    });
  }
};

// @desc    Get user payments
// @route   GET /api/payments
// @access  Private
exports.getPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let query = { user: req.user._id };
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate('lawyer', 'user consultationFee')
      .populate('lawyer.user', 'name email profilePicture')
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
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting payments',
      error: error.message
    });
  }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('lawyer', 'user consultationFee')
      .populate('lawyer.user', 'name email profilePicture')
      .populate('case', 'title status description');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if user has access to this payment
    if (payment.user._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to payment'
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
// @route   POST /api/payments/:id/refund
// @access  Private
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

    // Process refund with Stripe
    const refundAmount = amount || payment.amount;
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      amount: Math.round(refundAmount * 100), // Convert to paise
      reason: 'requested_by_customer',
      metadata: {
        reason: reason || 'Customer requested refund'
      }
    });

    // Update payment record
    payment.status = 'refunded';
    payment.refundAmount = refundAmount;
    payment.refundReason = reason;
    payment.refundedAt = new Date();

    await payment.save();

    // Update case status if full refund
    if (refundAmount >= payment.amount) {
      await Case.findByIdAndUpdate(payment.case, {
        paymentStatus: 'refunded'
      });
    }

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refund: {
        id: refund.id,
        amount: refundAmount,
        status: refund.status
      }
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

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
exports.getPaymentHistory = async (req, res) => {
  try {
    const { period = 'all', startDate, endDate } = req.query;

    let dateFilter = {};
    
    if (period !== 'all') {
      const now = new Date();
      let start;
      
      switch (period) {
        case 'week':
          start = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          start = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          start = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
      }
      
      if (start) {
        dateFilter.createdAt = { $gte: start };
      }
    }

    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const query = { user: req.user._id, ...dateFilter };

    const payments = await Payment.find(query)
      .populate('lawyer', 'user consultationFee')
      .populate('lawyer.user', 'name email')
      .populate('case', 'title status')
      .sort({ createdAt: -1 });

    // Calculate summary statistics
    const summary = {
      totalPayments: payments.length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      successfulPayments: payments.filter(p => p.status === 'succeeded').length,
      refundedPayments: payments.filter(p => p.status === 'refunded').length,
      totalRefunded: payments
        .filter(p => p.status === 'refunded')
        .reduce((sum, p) => sum + (p.refundAmount || 0), 0)
    };

    res.json({
      success: true,
      payments,
      summary
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting payment history',
      error: error.message
    });
  }
};
