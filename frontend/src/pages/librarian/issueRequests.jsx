import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";

export default function IssueRequests() {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/librarian/requests/pending");
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setMessage("Error loading pending requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (borrowId) => {
    if (!user?.LIBRARIAN_ID) {
      setMessage("Error: Librarian not logged in");
      return;
    }

    try {
      setMessage("");
      await api.post(`/librarian/requests/approve/${borrowId}`, {
        librarian_id: user.LIBRARIAN_ID,
      });
      setMessage(`✅ Book issued successfully!`);
      
      // Refresh requests
      setTimeout(() => {
        fetchRequests();
        setMessage("");
      }, 1500);
    } catch (err) {
      console.error("Error approving request:", err);
      setMessage(err.response?.data?.error || "Error issuing book.");
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
            <Link to="/librarian/issue-requests" className="hover:underline font-semibold transition border-b-2 border-white">
              Issue Requests
            </Link>
            <Link to="/librarian/return-book" className="hover:underline font-semibold transition">
              Return Book
            </Link>
            <Link to="/librarian/borrows" className="hover:underline font-semibold transition">
              View Borrows
            </Link>
            <button onClick={logout} className="bg-white text-[#8b0000] font-semibold px-4 py-1 rounded hover:bg-gray-100 transition">
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="p-8 space-y-6">
        {/* Page Title */}
        <div>
          <h2 className="text-3xl font-bold text-[#8b0000]">📋 Pending Issue Requests</h2>
          <p className="text-gray-600 mt-1">
            Review and approve student borrow requests
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`px-4 py-3 rounded-md border ${
            message.includes("✅") 
              ? "bg-green-100 text-green-800 border-green-300" 
              : "bg-red-100 text-red-800 border-red-300"
          }`}>
            {message}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white shadow-md rounded-lg p-12 text-center border border-gray-200">
            <p className="text-gray-600 text-lg">Loading requests...</p>
          </div>
        ) : requests.length > 0 ? (
          /* Requests Table */
          <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#8b0000] text-white">
                  <tr>
                    <th className="p-4 text-left font-semibold">Request ID</th>
                    <th className="p-4 text-left font-semibold">Student Name</th>
                    <th className="p-4 text-left font-semibold">ERP ID</th>
                    <th className="p-4 text-left font-semibold">Email</th>
                    <th className="p-4 text-left font-semibold">Book Title</th>
                    <th className="p-4 text-left font-semibold">Author</th>
                    <th className="p-4 text-left font-semibold">Available</th>
                    <th className="p-4 text-center font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr
                      key={req.BORROW_ID}
                      className="border-t border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="p-4 font-semibold text-gray-800">
                        #{req.BORROW_ID}
                      </td>
                      <td className="p-4 text-gray-800">
                        {req.FIRST_NAME} {req.LAST_NAME}
                      </td>
                      <td className="p-4 text-gray-600">{req.ERP_ID}</td>
                      <td className="p-4 text-gray-600 text-sm">
                        {req.EMAIL}
                      </td>
                      <td className="p-4 font-semibold text-[#8b0000]">
                        {req.BOOK_TITLE}
                      </td>
                      <td className="p-4 text-gray-600">{req.AUTHOR}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                            req.AVAILABLE_COPIES > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {req.AVAILABLE_COPIES} copies
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleApprove(req.BORROW_ID)}
                          disabled={req.AVAILABLE_COPIES === 0}
                          className={`px-4 py-2 rounded-md font-semibold transition ${
                            req.AVAILABLE_COPIES > 0
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {req.AVAILABLE_COPIES > 0 ? "Issue Book" : "Unavailable"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* No Requests */
          <div className="bg-white shadow-md rounded-lg p-12 text-center border border-gray-200">
            <p className="text-gray-600 text-lg">
              No pending requests at the moment.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              When students request books, they will appear here for approval.
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2">ℹ️ How it works</h3>
          <ul className="space-y-1 text-blue-800 text-sm">
            <li>• Students browse books and click "Borrow" to create a request</li>
            <li>• The request appears here with student details</li>
            <li>• Verify student identity and book availability at the counter</li>
            <li>• Click "Issue Book" to approve - the system will set issue/due dates automatically</li>
            <li>• Student will see the book status change from "Pending" to "Issued" in their dashboard</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
