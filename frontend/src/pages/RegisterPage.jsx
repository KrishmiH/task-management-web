import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [step, setStep] = useState(1); // 1: registration, 2: OTP verification
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    role: "user", // Default role
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await axios.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role, // Include role in registration
      });
      setStep(2);
      setMessage("Registration successful. Please check your email for OTP.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post("/auth/verify-otp", {
        email: form.email,
        otp: form.otp,
      });
      setMessage("Email verified! Please login.");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      {step === 1 && (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              className="w-full border p-2 rounded"
              placeholder="Name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Confirm Password"
              name="confirmPassword"
              type="password"
              required
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {message && (
              <div className="text-red-600 text-center font-semibold">{message}</div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Register
            </button>
          </form>
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <a href="/" className="text-blue-600 hover:underline">
              Login here
            </a>
          </p>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-center mb-4">
              Enter the 6-digit code sent to <strong>{form.email}</strong>
            </p>
            <input
              className="w-full border p-2 rounded text-center tracking-[0.5em]"
              placeholder="OTP"
              name="otp"
              type="text"
              maxLength={6}
              pattern="\d{6}"
              required
              value={form.otp}
              onChange={handleChange}
            />
            {message && (
              <div className="text-red-600 text-center font-semibold">{message}</div>
            )}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Verify OTP
            </button>
          </form>
        </>
      )}
    </div>
  );
}
