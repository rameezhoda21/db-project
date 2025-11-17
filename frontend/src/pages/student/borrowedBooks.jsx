import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";

export default function BorrowedBooks() {
  const { user, logout } = useAuth();
  const [borrowed, setBorrowed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?.ERP_ID) {
      fetchBorrowed();
    }
  }, [user]);

  const fetchBorrowed = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/student/borrowed/${user.ERP_ID}`);
      setBorrowed(res.data);
    } catch (err) {
      console.error("Error fetching borrowed books:", err);
      setMessage("Error loading borrowed books.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysRemaining = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-[#fff6f6] text-[#2b2b2b]">
      {/* Navbar */}
      <header className="bg-[#8b0000] text-white py-4 px-8 shadow-md sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">🎓 Student Dashboard</h1>
          <nav className="flex items-center gap-6">
            <Link
              to="/student"
              className="hover:underline font-semibold transition"
            >
              Home
            </Link>
            <Link
              to="/student/search-books"
              className="hover:underline font-semibold transition"
            >
              Search Books
            </Link>
            <Link
              to="/student/borrowed-books"
              className="hover:underline font-semibold transition border-b-2 border-white"
            >
              My Books
            </Link>
            <Link
              to="/student/fines"
              className="hover:underline font-semibold transition"
            >
              Fines
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
        {/* Page Title */}
        <div>
          <h2 className="text-3xl font-bold text-[#8b0000]">📖 My Books</h2>
          <p className="text-gray-600 mt-1">
            View your borrow requests and issued books
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="bg-red-100 text-red-800 border border-red-300 px-4 py-3 rounded-md">
            {message}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white shadow-md rounded-lg p-12 text-center border border-gray-200">
            <p className="text-gray-600 text-lg">Loading borrowed books...</p>
          </div>
        ) : borrowed.length > 0 ? (
          /* Borrowed Books Table */
          <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#8b0000] text-white">
                  <tr>
                    <th className="p-4 text-left font-semibold">Book Title</th>
                    <th className="p-4 text-left font-semibold">Author</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                    <th className="p-4 text-left font-semibold">Issue Date</th>
                    <th className="p-4 text-left font-semibold">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowed.map((book, index) => {
                    const isPending = book.STATUS === 'PENDING';
                    const daysRemaining = !isPending ? getDaysRemaining(book.DUE_DATE) : null;
                    const isOverdue = daysRemaining !== null && daysRemaining < 0;
                    const isDueSoon = daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 3;

                    return (
                      <tr
                        key={book.BORROW_ID || index}
                        className="border-t border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="p-4 font-semibold text-gray-800">
                          {book.TITLE}
                        </td>
                        <td className="p-4 text-gray-600">{book.AUTHOR}</td>
                        <td className="p-4">
                          {isPending ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                              Pending Approval
                            </span>
                          ) : isOverdue ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                              Overdue ({Math.abs(daysRemaining)} days)
                            </span>
                          ) : isDueSoon ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                              Due in {daysRemaining} days
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                              Issued
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-gray-600">
                          {isPending ? '—' : formatDate(book.ISSUE_DATE)}
                        </td>
                        <td className="p-4 text-gray-600">
                          {isPending ? '—' : formatDate(book.DUE_DATE)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* No Borrowed Books */
          <div className="bg-white shadow-md rounded-lg p-12 text-center border border-gray-200">
            <p className="text-gray-600 text-lg mb-4">
              You haven't requested or borrowed any books yet.
            </p>
            <Link
              to="/student/search-books"
              className="inline-block bg-[#8b0000] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#a81818] transition"
            >
              Browse Books
            </Link>
          </div>
        )}

        {/* Summary Card */}
        {borrowed.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-[#8b0000] mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-yellow-600">
                  {
                    borrowed.filter(
                      (b) => b.STATUS === 'PENDING'
                    ).length
                  }
                </p>
                <p className="text-gray-600 text-sm mt-1">Pending Approval</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">
                  {
                    borrowed.filter(
                      (b) => b.STATUS === 'ISSUED' && getDaysRemaining(b.DUE_DATE) >= 0
                    ).length
                  }
                </p>
                <p className="text-gray-600 text-sm mt-1">Issued</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-red-600">
                  {
                    borrowed.filter(
                      (b) => b.STATUS === 'ISSUED' && getDaysRemaining(b.DUE_DATE) < 0
                    ).length
                  }
                </p>
                <p className="text-gray-600 text-sm mt-1">Overdue</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
