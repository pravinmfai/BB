// backend/controllers/cartController.js
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');

// Fetch the cart items for a specific user
const getCartItems = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add or update item quantity in the cart
const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;
    

    // Log the productId for debugging
    // console.log('Product ID:', productId);
    // console.log('User ID:', userId);
    // console.log('Request User:', req.user);
    // console.log('Database Name:', mongoose.connection.name); // This gets the name of the current database
    // console.log('Collection Name:', Product.collection.collectionName); // This gets the name of the collection
    // console.log('Product Collection Count:', await Product.collection.countDocuments());

    const product = await Product.find({ _id: productId });
    console.log('Fetched Product:', product);
    if (!product) {
      console.log('Request Body:', req.body); // Log the request body
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the user's cart or create a new one
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Find if the product is already in the cart
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      // If product exists in the cart, update the quantity
      cart.items[itemIndex].quantity = quantity;
    } else {
      // If product doesn't exist, add it to the cart
      cart.items.push({ productId, quantity });
    }

    // Save the updated cart
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove an item from the cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item in the cart and remove it
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    // Save the updated cart
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear the cart for the user
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Clear all items in the cart
    cart.items = [];
    await cart.save();

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCartItems, updateCart, removeFromCart, clearCart };
