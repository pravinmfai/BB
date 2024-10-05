// backend/config/razorpay.js
const Razorpay = require('razorpay');

// Initialize Razorpay instance with keys from environment variables
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpayInstance;
