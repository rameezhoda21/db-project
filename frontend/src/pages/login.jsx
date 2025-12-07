import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/authContext";
import { showError, showSuccess } from "../utils/toast";

export default function Login() {
  const [searchParams] = useSearchParams();
  const [erpId, setErpId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(searchParams.get("role") || "student");
  const [useAdminId, setUseAdminId] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Load saved credentials on mount
  useEffect(() => {
    const urlRole = searchParams.get("role");
    if (urlRole) {
      setRole(urlRole);
      loadRememberedCredentials(urlRole);
    } else {
      const savedRole = localStorage.getItem("rememberedRole");
      if (savedRole) {
        setRole(savedRole);
        loadRememberedCredentials(savedRole);
      } else {
        loadRememberedCredentials(role);
      }
    }
  }, [searchParams]);

  // Load role-specific remembered credentials
  const loadRememberedCredentials = (userRole) => {
    const savedEmail = localStorage.getItem(`rememberedEmail_${userRole}`);
    const savedUseId = localStorage.getItem(`rememberedUseId_${userRole}`);
    
    if (savedEmail) {
      if (savedUseId === "true" && userRole === "admin") {
        setErpId(savedEmail);
        setUseAdminId(true);
      } else {
        setEmail(savedEmail);
      }
      setRememberMe(true);
    } else {
      setRememberMe(false);
    }
  };

  // Clear email/erpId and load credentials when role changes
  useEffect(() => {
    setEmail("");
    setErpId("");
    setUseAdminId(false);
    loadRememberedCredentials(role);
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Students and librarians use email, admin uses ID or email based on toggle
      const res = await api.post("/auth/login", {
        email: role !== "admin" ? email : (!useAdminId ? email : null),
        erpId: role === "admin" && useAdminId ? erpId : (role === "admin" && !useAdminId ? email : null),
        password,
        role,
      });
      
      // Store token
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // Remember Me functionality (role-specific)
      if (rememberMe) {
        localStorage.setItem(`rememberedEmail_${role}`, useAdminId ? erpId : email);
        localStorage.setItem(`rememberedUseId_${role}`, useAdminId.toString());
        localStorage.setItem("rememberedRole", role);
      } else {
        localStorage.removeItem(`rememberedEmail_${role}`);
        localStorage.removeItem(`rememberedUseId_${role}`);
        // Don't remove rememberedRole unless all roles are cleared
      }
      
      login(res.data);

      // Show welcome toast
      const userName = res.data.user?.firstName || res.data.user?.FIRST_NAME || "User";
      showSuccess(`Welcome back, ${userName}!`);

      if (role === "student") navigate("/student");
      else if (role === "librarian") navigate("/librarian");
      else if (role === "admin") navigate("/admin");
    } catch (err) {
      showError(err.response?.data?.error || "Invalid credentials");
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
              className={`px-3 py-2 rounded-full font-semibold text-sm transition ${role === "student"
                  ? "bg-iba-red text-white shadow"
                  : "text-gray-700 hover:bg-gray-200"
                }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("librarian")}
              className={`px-3 py-2 rounded-full font-semibold text-sm transition ${role === "librarian"
                  ? "bg-iba-red text-white shadow"
                  : "text-gray-700 hover:bg-gray-200"
                }`}
            >
              Librarian
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`px-3 py-2 rounded-full font-semibold text-sm transition ${role === "admin"
                  ? "bg-iba-red text-white shadow"
                  : "text-gray-700 hover:bg-gray-200"
                }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {role === "admin" ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-semibold">{useAdminId ? "Admin ID" : "Email"}</label>
                <button
                  type="button"
                  onClick={() => { setUseAdminId(!useAdminId); setErpId(""); setEmail(""); }}
                  className="text-xs text-iba-red hover:underline font-semibold"
                >
                  {useAdminId ? "Login with Email" : "Login with ID"}
                </button>
              </div>
              <input
                type={useAdminId ? "text" : "email"}
                value={useAdminId ? erpId : email}
                onChange={(e) => useAdminId ? setErpId(e.target.value) : setEmail(e.target.value)}
                placeholder={useAdminId ? "Enter Admin ID (e.g. 1)" : "Enter your email"}
                autoComplete={useAdminId ? "username" : "username email"}
                name={useAdminId ? "adminId" : "email"}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-iba-red focus:outline-none"
                required
              />
            </div>
          ) : (
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
                autoComplete="username email"
                name="email"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-iba-red focus:outline-none"
                required
              />
            </div>
          )}

          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-iba-red focus:outline-none"
              required
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-iba-red border-gray-300 rounded focus:ring-iba-red focus:ring-2"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="mt-2 w-full bg-iba-red hover:bg-iba-dark text-white py-2.5 rounded-md font-semibold transition-all duration-200"
          >
            Login as {role === "student" ? "Student" : role === "librarian" ? "Librarian" : "Admin"}
          </button>

          {/* Forgot Password */}
          <Link
            to={`/forgot-password?role=${role}`}
            className="text-sm text-iba-red hover:underline font-semibold text-center mt-2 block"
          >
            Forgot Password?
          </Link>
        </form>

        {/* Sign Up Link */}
        <div className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{" "}
          <Link to={`/signup?role=${role}`} className="text-iba-red font-semibold hover:underline">
            Sign up here
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-4">
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
