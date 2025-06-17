import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import TaskList from "./pages/TaskList";
import AddEditTask from "./pages/AddEditTask";
import TaskDetails from "./pages/TaskDetails";
import UserProfile from "./pages/UserProfile";
import AdminUserManagement from "./pages/AdminUserManagement";
import NotFoundPage from "./pages/NotFoundPage";
import ForgotPasswordPage from "./pages/ForgotPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/tasks/add" element={<AddEditTask />} />
        <Route path="/tasks/edit/:id" element={<AddEditTask />} />
        <Route path="/tasks/:id" element={<TaskDetails />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/admin/users" element={<AdminUserManagement />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
