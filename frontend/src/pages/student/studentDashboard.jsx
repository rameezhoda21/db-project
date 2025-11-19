import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    borrowedBooks: 0,
    totalFine: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.ERP_ID) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch total books
      const booksRes = await api.get("/student/books");
      
      // Fetch borrowed books
      const borrowedRes = await api.get(`/student/borrowed/${user.ERP_ID}`);
      
      // Fetch fines
      const fineRes = await api.get(`/student/fines/${user.ERP_ID}`);
      
      setStats({
        totalBooks: booksRes.data?.length || 0,
        borrowedBooks: borrowedRes.data?.length || 0,
        totalFine: fineRes.data?.FINE_DUE || 0,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
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
              className="hover:underline font-semibold transition border-b-2 border-white"
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
              className="hover:underline font-semibold transition"
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
        {/* Welcome Section */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-[#8b0000]">
            Welcome, {user?.FIRST_NAME || "Student"}! 👋
          </h2>
          <p className="text-gray-600 mt-2">
            Your Student ID: {user?.ERP_ID}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white shadow-md rounded-lg p-12 text-center border border-gray-200">
            <p className="text-gray-600 text-lg">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Books */}
              <Link
                to="/student/search-books"
                className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">
                      Total Books Available
                    </p>
                    <p className="text-4xl font-bold text-[#8b0000] mt-2">
                      {stats.totalBooks}
                    </p>
                  </div>
                  <div className="text-5xl">📚</div>
                </div>
                <p className="text-gray-500 text-xs mt-4">
                  Click to browse all books
                </p>
              </Link>

              {/* Borrowed Books */}
              <Link
                to="/student/borrowed-books"
                className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">
                      Currently Borrowed
                    </p>
                    <p className="text-4xl font-bold text-blue-600 mt-2">
                      {stats.borrowedBooks}
                    </p>
                  </div>
                  <div className="text-5xl">📖</div>
                </div>
                <p className="text-gray-500 text-xs mt-4">
                  View your borrowed books
                </p>
              </Link>

              {/* Outstanding Fines */}
              <Link
                to="/student/fines"
                className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">
                      Outstanding Fines
                    </p>
                    <p
                      className={`text-4xl font-bold mt-2 ${
                        stats.totalFine > 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      ₨ {stats.totalFine.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-5xl">💰</div>
                </div>
                <p className="text-gray-500 text-xs mt-4">
                  {stats.totalFine > 0 ? "Pay at library counter" : "No fines due"}
                </p>
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-[#8b0000] mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/student/search-books"
                  className="flex items-center gap-4 p-4 bg-[#fff6f6] rounded-lg hover:bg-[#ffe6e6] transition"
                >
                  <div className="text-3xl">🔍</div>
                  <div>
                    <p className="font-semibold text-[#8b0000]">Search Books</p>
                    <p className="text-sm text-gray-600">
                      Browse and search library inventory
                    </p>
                  </div>
                </Link>

                <Link
                  to="/student/borrowed-books"
                  className="flex items-center gap-4 p-4 bg-[#fff6f6] rounded-lg hover:bg-[#ffe6e6] transition"
                >
                  <div className="text-3xl">📋</div>
                  <div>
                    <p className="font-semibold text-[#8b0000]">My Books</p>
                    <p className="text-sm text-gray-600">
                      View your requests and issued books
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Important Notice */}
            {stats.totalFine > 0 && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  ⚠️ Action Required
                </h3>
                <p className="text-red-800">
                  You have an outstanding fine of ₨ {stats.totalFine.toFixed(2)}.
                  Please{" "}
                  <Link
                    to="/student/fines"
                    className="underline font-semibold hover:text-red-900"
                  >
                    pay your fine
                  </Link>{" "}
                  to continue borrowing books.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}