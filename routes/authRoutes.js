
// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');

// register
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  ],
  authController.register
);

// login
router.post('/login', authController.login);

// refresh token
router.post('/refresh', authController.refresh);

// logout
router.post('/logout', authController.logout);

module.exports = router;
