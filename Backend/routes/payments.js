const express = require('express');
const { 
  createPaymentIntent,
  confirmPayment,
  getPayments,
  getPaymentById,
  processRefund,
  getPaymentHistory
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Payment routes
router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.get('/', getPayments);
router.get('/history', getPaymentHistory);
router.get('/:id', getPaymentById);
router.post('/:id/refund', processRefund);

module.exports = router;
