// User Registration Controller with Password Hashing and OTP Generation
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendOTPEmail } = require('../utils/email');

const OTP_EXPIRY_MINUTES = 10;

// Register endpoint:
// 1) Hash password
// 2) Generate OTP and save with expiry
// 3) Send OTP via email
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body; // Include role in the request
    // Check for existing user
    const existingUser  = await User.findOne({ email });
    if (existingUser ) return res.status(400).json({ message: 'Email already registered' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

    // Create user with OTP but inactive for now
    const user = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      isActive: false,
      role: role || 'user', // Default to 'user' if no role provided
    });

    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(201).json({ message: 'User  registered. Please verify OTP sent to your email.' });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// OTP Verification Endpoint - activate user if OTP valid
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User  not found' });
    if (user.isActive) return res.status(400).json({ message: 'User  already verified' });

    if (!user.otp || !user.otpExpires) return res.status(400).json({ message: 'No OTP set. Please register again' });

    if (new Date() > user.otpExpires) return res.status(400).json({ message: 'OTP expired. Please request a new one.' });

    if (otp !== user.otp) return res.status(400).json({ message: 'Invalid OTP' });

    // Activate user and clear OTP fields
    user.isActive = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.json({ message: 'User  verified successfully' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

// User Login with JWT Token Generation
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.isActive) return res.status(400).json({ message: 'User  not verified' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create JWT Payload
    const payload = { id: user._id, role: user.role };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
