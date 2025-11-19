import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";

export default function Fines() {
  const { user, logout } = useAuth();
  const [fines, setFines] = useState([]);
  const [totalFine, setTotalFine] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?.ERP_ID) {
      fetchFines();
      fetchTotalFine();
    }
  }, [user]);

  const fetchFines = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/student/fines/${user.ERP_ID}`);
      // Assuming the backend returns an array of fines with book details
      setFines(res.data.fines || []);
    } catch (err) {
      console.error("Error fetching fines:", err);
      setMessage("Error loading fine details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalFine = async () => {
    try {
      const res = await api.get(`/student/fines/${user.ERP_ID}`);
      setTotalFine(res.data?.FINE_DUE || 0);
    } catch (err) {
      console.error("Error fetching total fine:", err);
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

  const calculateDaysLate = (dueDate, returnDate) => {
    if (!dueDate || !returnDate) return 0;
    const due = new Date(dueDate);
    const returned = new Date(returnDate);
    const diffTime = returned - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
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
              className="hover:underline font-semibold transition"
            >
              My Books
            </Link>
            <Link
              to="/student/fines"
              className="hover:underline font-semibold transition border-b-2 border-white"
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
          <h2 className="text-3xl font-bold text-[#8b0000]">💰 My Fines</h2>
          <p className="text-gray-600 mt-1">
            View all fines for books returned after the due date
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`px-4 py-3 rounded-md ${
              message.includes("successfully")
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* Total Fine Card */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Total Outstanding Fine
              </h3>
              <p className="text-4xl font-bold text-[#8b0000] mt-2">
                ₨ {totalFine.toFixed(2)}
              </p>
            </div>
            {totalFine > 0 && (
              <div className="bg-blue-50 border border-blue-300 rounded-lg px-6 py-4 max-w-md">
                <p className="text-blue-900 font-semibold text-sm">
                  💳 Please pay your fine at the library counter
                </p>
                <p className="text-blue-700 text-xs mt-1">
                  Visit the circulation desk during working hours to clear your outstanding balance
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white shadow-md rounded-lg p-12 text-center border border-gray-200">
            <p className="text-gray-600 text-lg">Loading fine details...</p>
          </div>
        ) : fines.length > 0 ? (
          /* Fines Table */
          <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#8b0000] text-white">
                  <tr>
                    <th className="p-4 text-left font-semibold">Book Title</th>
                    <th className="p-4 text-left font-semibold">Due Date</th>
                    <th className="p-4 text-left font-semibold">Return Date</th>
                    <th className="p-4 text-left font-semibold">Days Late</th>
                    <th className="p-4 text-left font-semibold">Fine Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {fines.map((fine, index) => {
                    const daysLate = calculateDaysLate(
                      fine.DUE_DATE,
                      fine.RETURN_DATE
                    );

                    return (
                      <tr
                        key={fine.FINE_ID || index}
                        className="border-t border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="p-4 font-semibold text-gray-800">
                          {fine.BOOK_TITLE || "Unknown Book"}
                        </td>
                        <td className="p-4 text-gray-600">
                          {formatDate(fine.DUE_DATE)}
                        </td>
                        <td className="p-4 text-gray-600">
                          {formatDate(fine.RETURN_DATE)}
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            {daysLate} days
                          </span>
                        </td>
                        <td className="p-4 font-bold text-[#8b0000]">
                          ₨ {fine.FINE_AMOUNT?.toFixed(2) || "0.00"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* No Fines */
          <div className="bg-white shadow-md rounded-lg p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-gray-600 text-lg mb-2">
              You have no outstanding fines!
            </p>
            <p className="text-gray-500 text-sm">
              Keep returning books on time to maintain a clean record.
            </p>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            ℹ️ Fine Policy
          </h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Fines are calculated based on the number of days overdue</li>
            <li>• Late returns may affect your borrowing privileges</li>
            <li>• Pay fines at the library counter to continue borrowing books</li>
            <li>• Contact the librarian if you have questions about fines</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
