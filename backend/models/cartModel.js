// backend/models/cartModel.js
const mongoose = require('mongoose');

// Define the cart item schema
const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

// Define the cart schema
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [cartItemSchema],
});

// Create the cart model
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
