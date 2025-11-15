import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext"; // ✅ import the provider

import Landing from "./pages/landing";
import Login from "./pages/login";
import StudentDashboard from "./pages/student/studentDashboard";
import BrowseBooks from "./pages/student/browseBooks";
import LibrarianDashboard from "./pages/librarian/librarianDashboard";
import AdminDashboard from "./pages/admin/adminDashboard";

function App() {
  return (
    // ✅ Wrap everything in AuthProvider
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/books" element={<BrowseBooks />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/librarian" element={<LibrarianDashboard />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
