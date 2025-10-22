import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/authContext";

export default function Login() {
  const [erpId, setErpId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { erpId, password, role });
      login(res.data);

      if (role === "student") navigate("/student");
      else if (role === "librarian") navigate("/librarian");
    } catch {
      setError("Invalid ERP ID or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-iba-light to-white">
      <div className="bg-white text-iba-dark rounded-xl shadow-xl w-[90%] max-w-md p-10 border border-gray-200 relative">
        {/* 🔙 Back to Home */}
        <Link
          to="/"
          className="absolute top-5 left-5 text-sm font-semibold text-iba-red hover:text-iba-dark transition"
        >
          ← Back to Home
        </Link>

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-iba-red flex items-center justify-center mb-3">
            <span className="text-2xl font-bold text-white">📚</span>
          </div>
          <h2 className="text-2xl font-extrabold text-iba-red text-center">
            Library Management System
          </h2>
          <p className="text-gray-600 mt-2 text-sm text-center">
            Please log in to continue
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-100 rounded-full p-1">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
                role === "student"
                  ? "bg-iba-red text-white shadow"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("librarian")}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
                role === "librarian"
                  ? "bg-iba-red text-white shadow"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Librarian
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="block mb-1 font-semibold">
              {role === "student" ? "ERP ID" : "Username"}
            </label>
            <input
              type="text"
              value={erpId}
              onChange={(e) => setErpId(e.target.value)}
              placeholder={
                role === "student"
                  ? "Enter ERP ID (e.g. S123)"
                  : "Enter Librarian Username"
              }
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-iba-red focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-iba-red focus:outline-none"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md py-2 px-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 w-full bg-iba-red hover:bg-iba-dark text-white py-2.5 rounded-md font-semibold transition-all duration-200"
          >
            Login as {role === "student" ? "Student" : "Librarian"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-6">
          Need help? Contact{" "}
          <a
            href="mailto:library@iba.edu.pk"
            className="text-iba-red font-semibold hover:underline"
          >
            library@iba.edu.pk
          </a>
        </div>
      </div>
    </div>
  );
}
