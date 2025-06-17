import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Navbar() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/tasks", label: "Tasks" },
    { path: "/profile", label: "Profile" },
  ];

  return (
    <nav className="bg-white border-b border-gray-300 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-700">TaskManager</div>
            <div className="hidden md:flex md:ml-10 md:space-x-8">
              {navLinks.map(({ path, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    isActive
                      ? "border-b-2 border-blue-600 text-blue-700 px-3 py-2 font-semibold"
                      : "text-gray-700 hover:text-blue-600 px-3 py-2"
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <span className="hidden md:block mr-4 text-gray-700">
              {user ? `Hi, ${user.name}` : ""}
            </span>
            <button
              onClick={handleLogout}
              className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
              aria-label="Logout"
            >
              Logout
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden ml-2">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center justify-center p-2 rounded text-gray-700 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-label="Toggle navigation menu"
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  {menuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-300">
          {navLinks.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "block border-l-4 border-blue-600 bg-blue-50 text-blue-700 px-4 py-2 font-semibold"
                  : "block text-gray-700 hover:bg-gray-100 px-4 py-2"
              }
            >
              {label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="block w-full text-left text-red-600 hover:bg-gray-100 px-4 py-2"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
