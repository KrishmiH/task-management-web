import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-9xl font-extrabold text-gray-300">404</h1>
      <p className="text-2xl font-semibold text-gray-700 mt-6">
        Ooops! Page Not Found
      </p>
      <p className="text-gray-600 mt-2">
        The page you are looking for does not exist or you do not have access.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go to Home
      </Link>
    </div>
  );
}

