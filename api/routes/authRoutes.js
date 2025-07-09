const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Route to handle user signup
// Endpoint: POST /user/signup
// This route allows new users to create an account.
router.post('/user/signup', authController.signup);

// Route to handle user login
// Endpoint: POST /user/login
// This route authenticates existing users and returns a token if credentials are valid.
router.post('/user/login', authController.login);

module.exports = router;