const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function sendOTPEmail(toEmail, otpCode) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: toEmail,
    subject: 'Your OTP Code for Task Management App',
    html: `
      <h3>Your OTP Code</h3>
      <p>Please use the following OTP code to verify your email address. It will expire in 10 minutes.</p>
      <h2 style="color: #2e86de;">${otpCode}</h2>
      <p>If you did not request this code, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
}

module.exports = { sendOTPEmail };

