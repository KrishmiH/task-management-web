const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');
const User = require('../models/User');

// User registration with email/password and OTP email send
router.post('/register', authController.register);

// Verify OTP endpoint after registration
router.post('/verify-otp', authController.verifyOTP);

// User login with email/password
router.post('/login', authController.login);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const payload = { id: req.user._id, role: req.user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    // Redirect to frontend with token or send token JSON
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  }
);

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpires');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching profile', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;
    // Optional: validate name and email here
    // Update user data by ID from auth token
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, select: '-password -otp -otpExpires' } // exclude sensitive fields
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
