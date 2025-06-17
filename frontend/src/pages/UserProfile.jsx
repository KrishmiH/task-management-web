import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import AuthContext from "../context/AuthContext";
import LogoutButton from "../components/LogoutButton";
import { getErrorMessage } from "../utils/apiErrorHandler";
import Sidebar from "../components/Sidebar";

export default function UserProfile() {
  const { user, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("/auth/profile");
        setFormData({ name: res.data.name, email: res.data.email });
      } catch (error) {
        setMessage("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.put("/auth/profile", formData);
      setMessage("Profile updated successfully.");
      login(localStorage.getItem("token"), res.data); // Update auth context's user
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  if (loading) return <div className="p-6">Loading profile...</div>;

  const isAdmin = user?.role === "admin";

  const containerClass = isAdmin
    ? "flex bg-gray-900 text-white min-h-screen"
    : "flex min-h-screen bg-gray-50";

  const contentClass = isAdmin
    ? "max-w-md mx-auto p-4 bg-gray-800 rounded shadow mt-10 flex-grow"
    : "max-w-md mx-auto p-4 bg-white rounded shadow mt-10 flex-grow";

  const inputClass = isAdmin
    ? "w-full border border-gray-600 bg-gray-700 text-white p-2 rounded"
    : "w-full border p-2 rounded";

  const messageSuccessClass = "mb-4 px-4 py-2 rounded bg-green-100 text-green-700";
  const messageErrorClass = "mb-4 px-4 py-2 rounded bg-red-100 text-red-700";

  return (
    <div className={containerClass}>
      <Sidebar />
      <div className={contentClass}>
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>

        {message && (
          <div className={message.includes("success") ? messageSuccessClass : messageErrorClass}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="name" className="block font-semibold mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
            <LogoutButton />
          </div>
        </form>
      </div>
    </div>
  );
}
