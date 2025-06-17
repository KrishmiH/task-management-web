import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useParams, Link } from "react-router-dom";

export default function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTask() {
      try {
        const res = await axios.get(`/tasks/${id}`);
        setTask(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTask();
  }, [id]);

  if (!task) return <div className="p-6">Loading...</div>;

  return (
    <div className="mx-auto p-6 bg-white">
      <button
        onClick={() => navigate("/tasks")}
        className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
        aria-label="Back to Dashboard"
      >
        &larr; Back
      </button>
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-3xl font-bold mb-4">Task Details</h1>
      <div className="mb-4">
        <strong>Title:</strong> {task.title}
      </div>
      <div className="mb-4">
        <strong>Description:</strong> <p className="whitespace-pre-wrap">{task.description || "(No description)"}</p>
      </div>
      <div className="mb-4">
        <strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}
      </div>
      <div className="mb-4">
        <strong>Status:</strong> {task.status}
      </div>
      {/* <div className="mb-4">
        <strong>Assigned To:</strong> {task.assignedTo ? `${task.assignedTo.name} (${task.assignedTo.email})` : "Unassigned"}
      </div> */}
      {/* <div>
        <Link to="/tasks" className="text-blue-600 hover:underline">Back to Task List</Link>
      </div> */}
    </div>
    </div>
  );
}
