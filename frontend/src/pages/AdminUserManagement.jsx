import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "", isActive: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/admin/users");
      setUsers(res.data);
    } catch (e) {
      setError("Failed to load users. Make sure you have admin access.");
    } finally {
      setLoading(false);
    }
  }

  function openEditModal(user) {
    setEditUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
    setError("");
    setSuccess("");
  }

  function closeEditModal() {
    setEditUser(null);
    setError("");
    setSuccess("");
  }

  function handleChange(e) {
    const value =
      e.target.type === "select-one" && e.target.name === "isActive"
        ? e.target.value === "true"
        : e.target.value;
    setForm((prev) => ({ ...prev, [e.target.name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.put(`/admin/users/${editUser._id}`, {
        role: form.role,
        isActive: form.isActive,
      });
      setSuccess("User updated successfully.");
      await fetchUsers();
      setTimeout(closeEditModal, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user.");
    }
  }

  async function toggleActive(user) {
    setError("");
    setSuccess("");
    try {
      await axios.delete(`/admin/users/${user._id}`);
      setSuccess(`User ${user.isActive ? "deactivated" : "activated"}.`);
      await fetchUsers();
    } catch (err) {
      setError("Failed to update user status.");
    }
  }

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <Sidebar />
      <div className="p-6 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Admin User Management</h1>

        {error && (
          <div className="bg-red-800 border border-red-600 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-800 border border-green-600 text-green-200 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="overflow-x-auto bg-gray-800 rounded shadow">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Active
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500 italic">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {user.isActive ? (
                          <span className="text-green-400 font-semibold">Yes</span>
                        ) : (
                          <span className="text-red-400 font-semibold">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                        <button
                          className="inline-flex items-center justify-center bg-blue-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded transition"
                          onClick={() => openEditModal(user)}
                          aria-label={`Edit user ${user.name}`}
                        >
                          Edit
                        </button>
                        <button
                          className={`px-3 py-1 rounded text-white ${
                            user.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                          }`}
                          onClick={() => toggleActive(user)}
                          aria-label={`${user.isActive ? "Deactivate" : "Activate"} user ${user.name}`}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit User Modal */}
        {editUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-gray-800 rounded-lg shadow p-8 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-6">Edit User</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold mb-1" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    disabled
                    className="w-full border border-gray-600 bg-gray-700 text-gray-400 p-2 rounded cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    disabled
                    className="w-full border border-gray-600 bg-gray-700 text-gray-400 p-2 rounded cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1" htmlFor="role">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-600 bg-gray-700 text-white p-2 rounded"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1" htmlFor="isActive">
                    Active
                  </label>
                  <select
                    id="isActive"
                    name="isActive"
                    value={form.isActive}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-600 bg-gray-700 text-white p-2 rounded"
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>

                {error && <p className="text-red-400 font-semibold">{error}</p>}

                {success && <p className="text-green-400 font-semibold">{success}</p>}

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
