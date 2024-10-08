// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorMiddleware');
const razorpayInstance = require('./config/razorpay');
const cors = require('cors');

// Import routes
const cartRoutes = require('./routes/cartRoutes');
const addressRoutes = require('./routes/addressRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();


// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // To parse cookies
app.use(cors());

// Use the routes
app.use('/api/cart', cartRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes); // Authentication routes

// Error handling middleware
app.use(errorHandler); // Custom error handling middleware

// Server listening on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
