// backend/controllers/cartController.js
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

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

    // Find the product
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
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCartItems, updateCart };
