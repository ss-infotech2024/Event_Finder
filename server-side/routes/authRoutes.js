// server/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes working' });
});

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Get current user profile (protected route)
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;