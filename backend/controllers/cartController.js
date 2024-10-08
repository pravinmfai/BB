// backend/controllers/cartController.js
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');

// Fetch the cart items for a specific user and calculate the total price
const getCartItems = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    // Calculate the total price of the cart items
    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);

    res.json({
      cart,
      totalPrice: totalPrice.toFixed(2) // Round to 2 decimal places
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add or update item quantity in the cart
const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
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

    // Recalculate the total price after updating the cart
    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);

    res.json({
      cart,
      totalPrice: totalPrice.toFixed(2)
    });
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

    // Remove the item from the cart
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    // Save the updated cart
    await cart.save();

    // Recalculate the total price after removing the item
    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);

    res.json({
      cart,
      totalPrice: totalPrice.toFixed(2)
    });
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
