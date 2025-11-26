import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";

export default function ViewBorrows() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBorrows();
  }, []);

  const fetchBorrows = async () => {
    try {
      const res = await api.get("/admin/borrows");
      setBorrows(res.data);
    } catch (err) {
      console.error("Error fetching borrows:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBorrows = borrows.filter((b) => {
    if (filter === "all") return true;
    return b.STATUS === filter;
  });

  return (
    <div className="min-h-screen bg-iba-light text-iba-dark">
      {/* Navbar */}
      <header className="bg-iba-red text-white py-4 px-8 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin")}
            className="text-white hover:text-gray-200 font-semibold"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold">📚 View Borrows</h1>
        </div>
        <button
          onClick={logout}
          className="bg-white text-iba-red font-semibold px-4 py-1 rounded hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </header>

      <main className="p-8">
        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              filter === "all"
                ? "bg-iba-red text-white"
                : "bg-white text-iba-dark border border-gray-300 hover:bg-gray-50"
            }`}
          >
            All ({borrows.length})
          </button>
          <button
            onClick={() => setFilter("PENDING")}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              filter === "PENDING"
                ? "bg-iba-red text-white"
                : "bg-white text-iba-dark border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Pending ({borrows.filter((b) => b.STATUS === "PENDING").length})
          </button>
          <button
            onClick={() => setFilter("ISSUED")}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              filter === "ISSUED"
                ? "bg-iba-red text-white"
                : "bg-white text-iba-dark border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Issued ({borrows.filter((b) => b.STATUS === "ISSUED").length})
          </button>
          <button
            onClick={() => setFilter("RETURNED")}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              filter === "RETURNED"
                ? "bg-iba-red text-white"
                : "bg-white text-iba-dark border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Returned ({borrows.filter((b) => b.STATUS === "RETURNED").length})
          </button>
        </div>

        {/* Borrows Table */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          {loading ? (
            <p className="text-center text-gray-600">Loading borrows...</p>
          ) : filteredBorrows.length === 0 ? (
            <p className="text-center text-gray-600">No borrows found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-iba-red text-white">
                  <tr>
                    <th className="p-3">Borrow ID</th>
                    <th className="p-3">Student</th>
                    <th className="p-3">Book Title</th>
                    <th className="p-3">Author</th>
                    <th className="p-3">Issue Date</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Return Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Librarian</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBorrows.map((borrow) => (
                    <tr
                      key={borrow.BORROW_ID}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-3">{borrow.BORROW_ID}</td>
                      <td className="p-3">
                        <span className="font-semibold">{borrow.STUDENT_NAME}</span>
                        <br />
                        <span className="text-xs text-gray-500">ERP: {borrow.ERP_ID}</span>
                      </td>
                      <td className="p-3 font-semibold">{borrow.TITLE}</td>
                      <td className="p-3">{borrow.AUTHOR}</td>
                      <td className="p-3">{borrow.ISSUE_DATE ? new Date(borrow.ISSUE_DATE).toLocaleDateString() : "-"}</td>
                      <td className="p-3">{borrow.DUE_DATE ? new Date(borrow.DUE_DATE).toLocaleDateString() : "-"}</td>
                      <td className="p-3">{borrow.RETURN_DATE ? new Date(borrow.RETURN_DATE).toLocaleDateString() : "-"}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            borrow.STATUS === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : borrow.STATUS === "ISSUED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {borrow.STATUS}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-600">{borrow.LIBRARIAN_NAME || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
