// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Protect routes: check if user is authenticated
const protect = async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    try {
      // Get token from cookie
      token = req.cookies.token;

      // Verify token and get user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password'); // Exclude password field

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
