import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import { FaTasks } from "react-icons/fa"; 
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import AuthContext from "../context/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { user } = useContext(AuthContext); // get current user from AuthContext

  const [tasks, setTasks] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    Pending: 0,
    "In Progress": 0,
    Completed: 0,
  });
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const tasksRes = await axios.get("/tasks");
        setTasks(tasksRes.data);

        const counts = tasksRes.data.reduce(
          (acc, task) => {
            const status = task.status || "Pending";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          },
          { Pending: 0, "In Progress": 0, Completed: 0 }
        );
        setStatusCounts(counts);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setErrorMsg("Failed to load data. Make sure you are logged in.");
      }
    }
    fetchData();
  }, []);

  const statusChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ["#fbbf24", "#3b82f6", "#16a34a"],
        borderColor: ["#fbbf24", "#3b82f6", "#16a34a"],
        borderWidth: 2,
      },
    ],
  };

  const tasksByMonth = tasks.reduce((acc, task) => {
    if (!task.createdAt) return acc;
    const date = new Date(task.createdAt);
    const key = date.toLocaleString("default", { month: "short", year: "numeric" });
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const monthsSorted = Object.keys(tasksByMonth).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const tasksByMonthData = {
    labels: monthsSorted,
    datasets: [
      {
        label: "Tasks Created",
        data: monthsSorted.map((m) => tasksByMonth[m]),
        backgroundColor: "#3b82f6",
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-grow p-8 max-w-7xl mx-auto overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-extrabold">Dashboard</h1>
          {user && (
            <div className="p-4 w-64 text-right">
              <p className="font-semibold mb-1">Logged in as:</p>
              <p className="text-gray-900 font-medium truncate">{user.name || "User"}</p>
              <p className="text-gray-500 text-sm truncate">{user.email}</p>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6 border border-red-300">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg transition-shadow cursor-pointer select-none">
            <div className="p-4 rounded-full bg-yellow-400 text-white mb-4 shadow-md">
              <FaTasks size={36} />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-center">Total Tasks</h2>
            <p className="text-6xl font-extrabold text-yellow-600 mb-2">{tasks.length}</p>
            <p className="text-gray-500">Tasks you have added</p>
          </div>

          <div className="bg-white rounded shadow p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Task Status Distribution</h2>
            {tasks.length > 0 ? (
              <div className="h-80 w-full max-w-sm">
                <Pie
                  data={statusChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: "bottom" } },
                  }}
                />
              </div>
            ) : (
              <p className="text-gray-500">No task data available</p>
            )}
          </div>
        </div>

        <section className="bg-white rounded shadow p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Tasks Created Over Time
          </h2>
          {tasks.length > 0 ? (
            <div className="h-80 w-full max-w-4xl">
              <Bar
                data={tasksByMonthData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { title: { display: true, text: "Month" } },
                    y: { title: { display: true, text: "Tasks Created" }, beginAtZero: true },
                  },
                }}
              />
            </div>
          ) : (
            <p className="text-center text-gray-500">No task data available</p>
          )}
        </section>
      </main>
    </div>
  );
}
