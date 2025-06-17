const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String, // hashed
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  isActive: { type: Boolean, default: true },
  otp: String,
  otpExpires: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);