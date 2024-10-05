// backend/controllers/addressController.js
const Address = require('../models/addressModel');

// Save the address of a user
const saveAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { street, city, state, zip } = req.body;

    // Find the user's address or create a new one
    let address = await Address.findOne({ userId });
    if (!address) {
      address = new Address({ userId });
    }

    // Update the address details
    address.street = street;
    address.city = city;
    address.state = state;
    address.zip = zip;

    // Save the address
    await address.save();
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch the address of a user
const getAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const address = await Address.findOne({ userId });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { saveAddress, getAddress };
