// backend/models/productModel.js
const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

// Create the product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
