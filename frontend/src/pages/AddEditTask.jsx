import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";

export default function AddEditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("Pending");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get("/admin/users");
        setUsers(res.data.filter(user => user.isActive && user.role === 'user'));
      } catch (err) {
        console.error(err);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    if (id) {
      async function fetchTask() {
        try {
          const res = await axios.get(`/tasks/${id}`);
          const task = res.data;
          setTitle(task.title);
          setDescription(task.description);
          setDeadline(task.deadline?.substring(0, 10) ?? "");
          setAssignedTo(task.assignedTo?._id || "");
          setStatus(task.status);
        } catch (error) {
          console.error(error);
        }
      }
      fetchTask();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    try {
      const payload = { title, description, deadline, assignedTo: assignedTo || null, status };
      if (id) {
        await axios.put(`/tasks/${id}`, payload);
      } else {
        await axios.post("/tasks", payload);
      }
      navigate("/tasks");
    } catch (error) {
      alert("Failed to save task");
      console.error(error);
    }
  };

  return (
    <div className="mx-auto p-6 bg-white">
      <button
        onClick={() => navigate("/tasks")}
        className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
        aria-label="Back to Dashboard"
      >
        &larr; Back
      </button>
    <div className="max-w-xl mx-auto p-6 rounded shadow bg-white mt-6">
      <h1 className="text-2xl font-bold mb-4">{id ? "Edit" : "Add"} Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        {/* <div>
          <label className="block font-semibold mb-1">Assign To</label>
          <select
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Unassigned --</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div> */}
        <div>
          <label className="block font-semibold mb-1">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            Save Task
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}
