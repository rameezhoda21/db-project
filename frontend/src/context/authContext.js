import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const AuthContext = createContext();

// Custom hook to use Auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 🔐 Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🟢 Login: save user info globally and persist in localStorage

const login = (userData) => {
  console.log("=== AUTH CONTEXT LOGIN ===");
  console.log("Raw userData received:", userData);
  
  const userToStore = userData.user || userData; // Handle both formats
  console.log("User to store:", userToStore);
  console.log("==========================");
  
  setUser(userToStore);
  localStorage.setItem("user", JSON.stringify(userToStore));
};

  // 🔴 Logout: clear user info and remove from localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
