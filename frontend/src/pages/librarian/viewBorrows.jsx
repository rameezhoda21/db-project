import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";

export default function ViewBorrows() {
  const { logout } = useAuth();
  const [borrows, setBorrows] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all' or 'active'

  useEffect(() => {
    fetchBorrows();
  }, [filter]);

  const fetchBorrows = async () => {
    try {
      const endpoint = filter === "active" ? "/librarian/borrows" : "/librarian/borrows/history";
      const res = await api.get(endpoint);
      setBorrows(res.data);
    } catch (err) {
      console.error("Error fetching borrows:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6f6] text-[#2b2b2b]">
      {/* Navbar */}
      <header className="bg-[#8b0000] text-white py-4 px-8 shadow-md sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">📚 Librarian Dashboard</h1>
          <nav className="flex items-center gap-6">
            <Link to="/librarian" className="hover:underline font-semibold transition">
              Home
            </Link>
            <Link to="/librarian/manage-books" className="hover:underline font-semibold transition">
              Manage Books
            </Link>
            <Link to="/librarian/issue-requests" className="hover:underline font-semibold transition">
              Issue Requests
            </Link>
            <Link to="/librarian/return-book" className="hover:underline font-semibold transition">
              Return Book
            </Link>
            <Link
              to="/librarian/borrows"
              className="hover:underline font-semibold transition border-b-2 border-white"
            >
              View Borrows
            </Link>
            <button onClick={logout} className="bg-white text-[#8b0000] font-semibold px-4 py-1 rounded hover:bg-gray-100 transition">
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#8b0000]">📋 View Borrows</h2>
            <p className="text-gray-600 mt-1">View all borrow records and history</p>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded-md font-semibold transition ${filter === "active" ? "bg-[#8b0000] text-white" : "bg-white text-gray-700 border border-gray-300"}`}
            >
              Active Only
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md font-semibold transition ${filter === "all" ? "bg-[#8b0000] text-white" : "bg-white text-gray-700 border border-gray-300"}`}
            >
              All History
            </button>
          </div>
        </div>

        {/* Borrows Table */}
        <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#8b0000] text-white">
                <tr>
                  <th className="p-4 text-left font-semibold">Borrow ID</th>
                  <th className="p-4 text-left font-semibold">Student Name</th>
                  <th className="p-4 text-left font-semibold">ERP ID</th>
                  <th className="p-4 text-left font-semibold">Book Title</th>
                  <th className="p-4 text-left font-semibold">Issue Date</th>
                  <th className="p-4 text-left font-semibold">Due Date</th>
                  <th className="p-4 text-left font-semibold">Return Date</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {borrows.map((borrow) => {
                  return (
                    <tr key={borrow.BORROW_ID} className="border-t border-gray-200 hover:bg-gray-50 transition">
                      <td className="p-4">{borrow.BORROW_ID}</td>
                      <td className="p-4 font-semibold">{borrow.STUDENT_NAME}</td>
                      <td className="p-4">{borrow.ERP_ID}</td>
                      <td className="p-4">{borrow.BOOK_TITLE}</td>
                      <td className="p-4">{new Date(borrow.ISSUE_DATE).toLocaleDateString()}</td>
                      <td className="p-4">{new Date(borrow.DUE_DATE).toLocaleDateString()}</td>
                      <td className="p-4">
                        {borrow.RETURN_DATE ? new Date(borrow.RETURN_DATE).toLocaleDateString() : "—"}
                      </td>
                      <td className="p-4">
                        {borrow.STATUS === "Active" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            Active
                          </span>
                        )}
                        {borrow.STATUS === "Returned Late" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            Returned Late
                          </span>
                        )}
                        {borrow.STATUS === "Returned On Time" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            Returned On Time
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {borrows.length === 0 && (
            <div className="p-12 text-center text-gray-600">
              <p className="text-lg">No borrow records found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
