// backend/models/addressModel.js
const mongoose = require('mongoose');

// Define the address schema
const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
});

// Create the address model
const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
