import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Sidebar() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/tasks", label: "Tasks" },
    { to: "/profile", label: "Profile" },
  ];

  const adminLinks = [
    { to: "/admin/users", label: "Admin User Management" },
    { to: "/profile", label: "Profile" },
  ];

  const links = user?.role === "admin" ? adminLinks : userLinks;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close sidebar menu" : "Open sidebar menu"}
      >
        {isOpen ? "Close" : "Menu"}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-800 shadow-md z-40 transform transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:w-56`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="text-2xl font-extrabold text-indigo-400 mb-10 select-none">
            TaskManager
          </div>

          <nav className="flex flex-col space-y-3 flex-grow">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg transition-colors duration-150 ${
                    isActive
                      ? "bg-indigo-600 text-white font-semibold"
                      : "text-gray-300 hover:bg-indigo-500 hover:text-white"
                  }`
                }
                onClick={() => setIsOpen(false)} // close menu on mobile
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-auto px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-lg transition-colors duration-150"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Padding to prevent content covered by sidebar */}
      <div
        className={`pt-16 md:ml-56 transition-all duration-200 ease-in-out`}
        aria-hidden={!isOpen}
      />
    </>
  );
}
