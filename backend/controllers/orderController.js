// backend/controllers/orderController.js
const Razorpay = require('razorpay');
const Order = require('../models/orderModel');
const razorpayInstance = require('../config/razorpay');

// Create an order and initiate Razorpay payment
const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { amount } = req.body; // Amount should be in paise

    const options = {
      amount: amount, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${userId}_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    // Save the order in the database
    const newOrder = new Order({
      userId,
      razorpayOrderId: order.id,
      amount,
      status: 'Pending',
    });

    await newOrder.save();

    res.json({ orderId: order.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Razorpay payment after checkout
const verifyOrder = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const crypto = require('crypto');
    const order = await Order.findOne({ razorpayOrderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify the signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Update the order status to 'Confirmed'
    order.razorpayPaymentId = razorpayPaymentId;
    order.status = 'Confirmed';
    await order.save();

    res.json({ message: 'Payment verified and order confirmed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, verifyOrder };
