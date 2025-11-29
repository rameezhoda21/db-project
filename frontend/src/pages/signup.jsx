import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function Signup() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    erpId: "",
    role: searchParams.get("role") || "student",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // Email validation by role
    if (formData.role === "student" && !formData.email.endsWith("@khi.iba.edu.pk")) {
      setError("Student email must be an IBA email (@khi.iba.edu.pk)");
      return;
    }

    if ((formData.role === "librarian" || formData.role === "admin") && !formData.email.endsWith("@gmail.com")) {
      setError(`${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} email must be a Gmail address`);
      return;
    }

    try {
      const res = await api.post("/auth/signup", {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        erpId: formData.role === "student" ? formData.erpId : null,
        role: formData.role,
      });

      setSuccess(res.data.message);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate(`/login?role=${formData.role}`);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    }
  };

  const getEmailPlaceholder = () => {
    if (formData.role === "student") return "yourname@khi.iba.edu.pk";
    return "yourname@gmail.com";
  };

  const getEmailHelp = () => {
    if (formData.role === "student") return "Use your IBA email address";
    return "Use a Gmail address";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-iba-light to-white py-8">
      <div className="bg-white text-iba-dark rounded-xl shadow-xl w-[90%] max-w-md p-10 border border-gray-200 relative">
        {/* Back to Home */}
        <Link
          to="/"
          className="absolute top-5 left-5 text-sm font-semibold text-iba-red hover:text-iba-dark transition"
        >
          ← Back to Home
        </Link>

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-iba-red flex items-center justify-center mb-3">
            <span className="text-2xl font-bold text-white">📝</span>
          </div>
          <h2 className="text-2xl font-extrabold text-iba-red text-center">
            Create Account
          </h2>
          <p className="text-gray-600 mt-2 text-sm text-center">
            Register for library access
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-100 rounded-full p-1">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "student", email: "", erpId: "" })}
              className={`px-3 py-2 rounded-full font-semibold text-sm transition ${
                formData.role === "student"
                  ? "bg-iba-red text-white shadow"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "librarian", email: "", erpId: "" })}
              className={`px-3 py-2 rounded-full font-semibold text-sm transition ${
                formData.role === "librarian"
                  ? "bg-iba-red text-white shadow"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Librarian
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "admin", email: "", erpId: "" })}
              className={`px-3 py-2 rounded-full font-semibold text-sm transition ${
                formData.role === "admin"
                  ? "bg-iba-red text-white shadow"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-semibold text-sm">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-iba-red focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-sm">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-iba-red focus:outline-none"
                required
              />
            </div>
          </div>

          {formData.role === "student" && (
            <div>
              <label className="block mb-1 font-semibold text-sm">ERP ID</label>
              <input
                type="text"
                name="erpId"
                value={formData.erpId}
                onChange={handleChange}
                placeholder="e.g., 26001"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-iba-red focus:outline-none"
                required={formData.role === "student"}
              />
              <p className="text-xs text-gray-500 mt-1">Your 5-digit student ERP ID</p>
            </div>
          )}

          <div>
            <label className="block mb-1 font-semibold text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={getEmailPlaceholder()}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-iba-red focus:outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">{getEmailHelp()}</p>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-iba-red focus:outline-none"
              required
              minLength={8}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-iba-red focus:outline-none"
              required
              minLength={8}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md py-2 px-3">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-md py-2 px-3">
              {success}
              <br />
              <span className="text-xs">Redirecting to login...</span>
            </div>
          )}

          <button
            type="submit"
            className="mt-2 w-full bg-iba-red hover:bg-iba-dark text-white py-2.5 rounded-md font-semibold transition-all duration-200"
          >
            Sign Up as {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{" "}
          <Link to={`/login?role=${formData.role}`} className="text-iba-red font-semibold hover:underline">
            Login here
          </Link>
        </div>

        <div className="text-center text-gray-500 text-xs mt-4">
          Your registration will be reviewed by an admin before you can log in.
        </div>
      </div>
    </div>
  );
}
