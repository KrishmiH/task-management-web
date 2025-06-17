import React, { useState, useContext } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import AuthContext from "../context/AuthContext";
import { getErrorMessage } from "../utils/apiErrorHandler";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpRequired, setIsOtpRequired] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (isOtpRequired && otp.length !== 6) {
      setMessage("Please enter the 6-digit OTP.");
      return;
    }

    try {
      if (!isOtpRequired) {
        const res = await axios.post("/auth/login", {
          email,
          password,
        });
        login(res.data.token, res.data.user);

        // Redirect based on user role
        if (res.data.user.role === "admin") {
          navigate("/admin/users"); // Redirect to Admin User Management
        } else {
          navigate("/dashboard"); // Redirect to User Dashboard
        }
      } else {
        // Adjust OTP verification flow if backend requires it
        await axios.post("/auth/verify-otp", { email, otp });
        setIsOtpRequired(false);
        setMessage("OTP verified. Please log in now.");
      }
    } catch (error) {
      if (error.response?.data?.message === "User  not verified") {
        setIsOtpRequired(true);
        setMessage("Please enter the OTP sent to your email.");
      } else {
        setMessage(getErrorMessage(error));
      }
    }
  };

  const onGoogleSuccess = async (credentialResponse) => {
    setMessage("");
    try {
      const res = await axios.post("/auth/google-token", {
        token: credentialResponse.credential,
      });
      login(res.data.token, res.data.user);

      // Redirect based on user role
      if (res.data.user.role === "admin") {
        navigate("/admin/users"); // Redirect to Admin User Management
      } else {
        navigate("/dashboard"); // Redirect to User Dashboard
      }
    } catch {
      setMessage("Google login failed.");
    }
  };

  const onGoogleFailure = () => {
    setMessage("Google login failed.");
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleLogin}>
        <label className="block mb-1 font-semibold">Email</label>
        <input
          type="email"
          required
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isOtpRequired}
          autoComplete="username"
        />
        <label className="block mb-1 font-semibold">Password</label>
        <input
          type="password"
          required
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isOtpRequired}
          autoComplete="current-password"
        />
        {isOtpRequired && (
          <>
            <label className="block mb-1 font-semibold">OTP</label>
            <input
              type="text"
              maxLength={6}
              required
              className="w-full mb-4 p-2 border rounded tracking-widest text-center"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              autoComplete="one-time-code"
              inputMode="numeric"
            />
          </>
        )}
        {message && (
          <div className="mb-4 text-red-600 font-semibold text-center">{message}</div>
        )}
        <button
          type="submit"
          className="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          {isOtpRequired ? "Verify OTP" : "Login"}
        </button>
      </form>

      <div className="my-6 text-center">OR</div>
      <div className="flex justify-center">
        <GoogleLogin onSuccess={onGoogleSuccess} onError={onGoogleFailure} />
      </div>

      <p className="mt-4 text-center">
        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          Forgot Password?
        </Link>
      </p>

      <p className="mt-6 text-center text-gray-700">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
