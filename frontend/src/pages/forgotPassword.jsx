import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { showSuccess, showError } from "../utils/toast";

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(searchParams.get("role") || "student");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", {
        email,
        role,
      });
      showSuccess(res.data.message);
      setEmail("");
    } catch (err) {
      showError(err.response?.data?.error || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-iba-light to-white">
      <div className="bg-white text-iba-dark rounded-xl shadow-xl w-[90%] max-w-md p-10 border border-gray-200 relative">
        {/* Back to Login */}
        <Link
          to={`/login?role=${role}`}
          className="absolute top-5 left-5 text-sm font-semibold text-iba-red hover:text-iba-dark transition"
        >
          ← Back to Login
        </Link>

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-iba-red flex items-center justify-center mb-3">
            <span className="text-2xl font-bold text-white">🔑</span>
          </div>
          <h2 className="text-2xl font-extrabold text-iba-red text-center">
            Forgot Password
          </h2>
          <p className="text-gray-600 mt-2 text-sm text-center">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-100 rounded-full p-1">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`px-3 py-2 rounded-full font-semibold text-sm transition ${
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
              className={`px-3 py-2 rounded-full font-semibold text-sm transition ${
                role === "librarian"
                  ? "bg-iba-red text-white shadow"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Librarian
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`px-3 py-2 rounded-full font-semibold text-sm transition ${
                role === "admin"
                  ? "bg-iba-red text-white shadow"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                role === "student"
                  ? "yourname@khi.iba.edu.pk"
                  : "yourname@gmail.com"
              }
              autoComplete="email"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-iba-red focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full bg-iba-red hover:bg-iba-dark text-white py-2.5 rounded-md font-semibold transition-all duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-6">
          Remember your password?{" "}
          <Link
            to={`/login?role=${role}`}
            className="text-iba-red font-semibold hover:underline"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
