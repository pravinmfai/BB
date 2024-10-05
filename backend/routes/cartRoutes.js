// backend/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const { getCartItems, updateCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware'); // For user authentication

// Route to get cart items for the logged-in user
router.get('/', protect, getCartItems);

// Route to add or update items in the cart
router.post('/', protect, updateCart);

module.exports = router;
