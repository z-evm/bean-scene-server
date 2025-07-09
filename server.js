const express = require('express'); // Importing the Express framework for routing and handling HTTP requests
const cors = require('cors'); // Importing CORS middleware to handle cross-origin requests
const { connectDB } = require('./config/mongoose'); // Importing the function to connect to the MongoDB database
const orderRoutes = require('./api/routes/orderRoutes'); // Importing the order routes
const menuRoutes = require('./api/routes/menuRoutes'); // Importing the menu routes
const authRoutes = require('./api/routes/authRoutes'); // Importing the authentication routes
const userRoutes = require('./api/routes/userRoutes'); // Importing the user management routes
require('dotenv').config(); // Loading environment variables from a .env file

const app = express(); // Creating an instance of the Express application
const port = process.env.PORT || 3000; // Use PORT environment variable or default to 3000

// Connect to the database
connectDB();

// Middleware setup
app.use(cors()); // Enabling CORS for handling cross-origin requests
app.use(express.json()); // Parsing incoming JSON requests

// Setting up routes for different API endpoints
app.use('/api/users', userRoutes); // All user-related routes will be prefixed with /api/users
app.use('/api/orders', orderRoutes); // All order-related routes will be prefixed with /api/orders
app.use('/api/menu-items', menuRoutes); // All menu item-related routes will be prefixed with /api/menu-items
app.use('/auth', authRoutes); // All authentication-related routes will be prefixed with /auth

// Start the server and listen on the specified port
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${port}`) // Log a message when the server starts
});

module.exports = { app, server };