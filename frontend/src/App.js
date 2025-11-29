import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext"; // ✅ import the provider

import Landing from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";
import StudentDashboard from "./pages/student/studentDashboard";
import BrowseBooks from "./pages/student/browseBooks";
import SearchBooks from "./pages/student/searchBooks";
import BorrowedBooks from "./pages/student/borrowedBooks";
import Fines from "./pages/student/fines";
import LibrarianDashboard from "./pages/librarian/librarianDashboard";
import ManageBooks from "./pages/librarian/manageBooks";
import IssueRequests from "./pages/librarian/issueRequests";
import ReturnBook from "./pages/librarian/returnBook";
import ViewBorrows from "./pages/librarian/viewBorrows";
import AdminDashboard from "./pages/admin/adminDashboard";
import AdminViewBorrows from "./pages/admin/viewBorrows";
import Inventory from "./pages/admin/inventory";
import RecentActivities from "./pages/admin/recentActivities";
import Registrations from "./pages/admin/registrations";
import ManageFines from "./pages/admin/manageFines";

function App() {
  return (
    // ✅ Wrap everything in AuthProvider
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Student Routes */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/books" element={<BrowseBooks />} />
          <Route path="/student/search-books" element={<SearchBooks />} />
          <Route path="/student/borrowed-books" element={<BorrowedBooks />} />
          <Route path="/student/fines" element={<Fines />} />
          
          {/* Librarian Routes */}
          <Route path="/librarian" element={<LibrarianDashboard />} />
          <Route path="/librarian/manage-books" element={<ManageBooks />} />
          <Route path="/librarian/issue-requests" element={<IssueRequests />} />
          <Route path="/librarian/return-book" element={<ReturnBook />} />
          <Route path="/librarian/borrows" element={<ViewBorrows />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/borrows" element={<AdminViewBorrows />} />
          <Route path="/admin/inventory" element={<Inventory />} />
          <Route path="/admin/activities" element={<RecentActivities />} />
          <Route path="/admin/registrations" element={<Registrations />} />
          <Route path="/admin/manage-fines" element={<ManageFines />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
