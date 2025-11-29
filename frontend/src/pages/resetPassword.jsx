import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../services/api";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword: password,
      });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-iba-light to-white">
      <div className="bg-white text-iba-dark rounded-xl shadow-xl w-[90%] max-w-md p-10 border border-gray-200 relative">
        {/* Back to Login */}
        <Link
          to="/login"
          className="absolute top-5 left-5 text-sm font-semibold text-iba-red hover:text-iba-dark transition"
        >
          ← Back to Login
        </Link>

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-iba-red flex items-center justify-center mb-3">
            <span className="text-2xl font-bold text-white">🔐</span>
          </div>
          <h2 className="text-2xl font-extrabold text-iba-red text-center">
            Reset Password
          </h2>
          <p className="text-gray-600 mt-2 text-sm text-center">
            Enter your new password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="block mb-1 font-semibold">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password (min 8 characters)"
              autoComplete="new-password"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-iba-red focus:outline-none"
              required
              disabled={!token}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              autoComplete="new-password"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-iba-red focus:outline-none"
              required
              disabled={!token}
            />
          </div>

          {message && (
            <div className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-md py-3 px-3">
              {message}
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md py-3 px-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !token}
            className={`mt-2 w-full bg-iba-red hover:bg-iba-dark text-white py-2.5 rounded-md font-semibold transition-all duration-200 ${
              loading || !token ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-6">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-iba-red font-semibold hover:underline"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
