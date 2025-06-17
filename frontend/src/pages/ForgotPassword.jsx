import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // Step 1: Request OTP, Step 2: Verify OTP + reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const requestOTP = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await axios.post("/auth/forgot-password", { email });
      setMessage("OTP sent to your email. Please check your inbox.");
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    if (newPassword.length < 6) {
      setMessage("Password must be minimum 6 characters");
      setLoading(false);
      return;
    }
    try {
      await axios.post("/auth/reset-password", { email, otp, newPassword });
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow">
      {step === 1 && (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-center">Forgot Password</h2>
          <form onSubmit={requestOTP} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Enter your registered email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-center">Reset Password</h2>
          <form onSubmit={resetPassword} className="space-y-4">
            <input
              type="text"
              required
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              className="w-full p-2 border rounded text-center tracking-widest"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
            />
            <input
              type="password"
              required
              placeholder="Enter new password (min 6 chars)"
              className="w-full p-2 border rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </>
      )}

      {message && <p className="mt-4 text-center text-red-600 font-semibold">{message}</p>}
    </div>
  );
}
