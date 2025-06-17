import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("deadline");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [search, statusFilter, sortBy]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      if (sortBy) params.append("sortBy", sortBy);

      const res = await axios.get(`/tasks?${params.toString()}`);
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      alert("Failed to delete task");
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await axios.get('/reports/tasks', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'task-report.pdf'); // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download PDF", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-6">Tasks</h1>
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <input
            type="text"
            placeholder="Search by title..."
            className="flex-grow p-2 border rounded shadow"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="p-2 border rounded shadow"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            className="p-2 border rounded shadow"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="deadline">Sort by Deadline</option>
            <option value="title">Sort by Title</option>
            <option value="status">Sort by Status</option>
          </select>
          <Link
            to="/tasks/add"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
          >
            Add Task
          </Link>
          <button
            onClick={downloadPDF}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow"
          >
            Download PDF
          </button>
        </div>

        {loading ? (
          <div className="text-center">Loading tasks...</div>
        ) : (
          <table className="w-full table-fixed border-collapse border border-gray-300 bg-white rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 w-1/4 text-left">Title</th>
                <th className="border border-gray-300 px-4 py-2 w-1/6 text-left">Deadline</th>
                <th className="border border-gray-300 px-4 py-2 w-1/6 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-2 w-1/4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center italic text-gray-500">
                    No tasks found
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{task.title}</td>
                    <td className="border border-gray-300 px-4 py-2">{new Date(task.deadline).toLocaleDateString()}</td>
                    <td className="border border-gray-300 px-4 py-2">{task.status}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/tasks/${task._id}`}
                          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded transition"
                          aria-label={`View task named ${task.title}`}
                        >
                          View
                        </Link>
                        <Link
                          to={`/tasks/edit/${task._id}`}
                          className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded transition"
                          aria-label={`Edit task named ${task.title}`}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded transition"
                          aria-label={`Delete task named ${task.title}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
