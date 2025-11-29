import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export default function LibrarianDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#fff6f6] text-[#2b2b2b]">
      {/* Navbar */}
      <header className="bg-[#8b0000] text-white py-4 px-8 shadow-md sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">📚 Librarian Dashboard</h1>
          <nav className="flex items-center gap-6">
            <Link
              to="/librarian"
              className="hover:underline font-semibold transition border-b-2 border-white"
            >
              Home
            </Link>
            <Link
              to="/librarian/manage-books"
              className="hover:underline font-semibold transition"
            >
              Manage Books
            </Link>
            <Link
              to="/librarian/issue-requests"
              className="hover:underline font-semibold transition"
            >
              Issue Requests
            </Link>
            <Link
              to="/librarian/return-book"
              className="hover:underline font-semibold transition"
            >
              Return Book
            </Link>
            <Link
              to="/librarian/borrows"
              className="hover:underline font-semibold transition"
            >
              View Borrows
            </Link>
            <button
              onClick={logout}
              className="bg-white text-[#8b0000] font-semibold px-4 py-1 rounded hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="p-8 space-y-6">
        {/* Welcome Section */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-[#8b0000]">
            Welcome, {user?.firstName || user?.FIRST_NAME || "Librarian"}! 👋
          </h2>
          <p className="text-gray-600 mt-2">
            Librarian ID: {user?.librarianId || user?.LIBRARIAN_ID}
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/librarian/manage-books"
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">
                  Manage Books
                </p>
                <p className="text-lg font-bold text-[#8b0000] mt-2">
                  Add, Edit, Delete
                </p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
            <p className="text-gray-500 text-xs mt-4">
              Manage library inventory
            </p>
          </Link>

          <Link
            to="/librarian/issue-requests"
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">
                  Issue Requests
                </p>
                <p className="text-lg font-bold text-blue-600 mt-2">
                  Approve Requests
                </p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
            <p className="text-gray-500 text-xs mt-4">
              Review and approve borrow requests
            </p>
          </Link>

          <Link
            to="/librarian/return-book"
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">
                  Return Book
                </p>
                <p className="text-lg font-bold text-green-600 mt-2">
                  Process Returns
                </p>
              </div>
              <div className="text-4xl">📥</div>
            </div>
            <p className="text-gray-500 text-xs mt-4">
              Process book returns
            </p>
          </Link>

          <Link
            to="/librarian/borrows"
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">
                  View Borrows
                </p>
                <p className="text-lg font-bold text-purple-600 mt-2">
                  All Records
                </p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
            <p className="text-gray-500 text-xs mt-4">
              View borrow history
            </p>
          </Link>
        </div>

        {/* Info Section */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-[#8b0000] mb-4">
            Librarian Functions
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#8b0000] font-bold">•</span>
              <span>
                <strong>Manage Books:</strong> Add new books to the inventory,
                edit book details, or remove books
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#8b0000] font-bold">•</span>
              <span>
                <strong>Issue Requests:</strong> Review pending borrow requests
                from students and approve them at the counter
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#8b0000] font-bold">•</span>
              <span>
                <strong>Return Books:</strong> Process book returns and
                automatically calculate fines for late returns
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#8b0000] font-bold">•</span>
              <span>
                <strong>View Borrows:</strong> See all active borrows and
                complete borrow history
              </span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
