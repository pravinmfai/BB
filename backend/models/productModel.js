// backend/models/productModel.js
const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  discountType: {
    type: String,
  },
  discountPercentage: {
    type: Number,
  },
  color: {
    type: [String], // Assuming color can be an array of strings
  },
  material: {
    type: String,
  },
  size: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
  },
  tags: {
    type: [String], // Assuming tags is an array of strings
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Create the product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
