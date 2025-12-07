import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";
import { showSuccess, showError, showWarning } from "../../utils/toast";
import ConfirmModal from "../../components/ConfirmModal";

export default function ReturnBook() {
  const { logout } = useAuth();
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [borrowToReturn, setBorrowToReturn] = useState(null);

  useEffect(() => {
    fetchActiveBorrows();
  }, []);

  const fetchActiveBorrows = async () => {
    try {
      const res = await api.get("/librarian/borrows");
      setActiveBorrows(res.data);
    } catch (err) {
      console.error("Error fetching borrows:", err);
    }
  };

  const handleReturn = (borrowId) => {
    setBorrowToReturn(borrowId);
    setShowReturnModal(true);
  };

  const confirmReturn = async () => {
    try {
      const res = await api.post("/librarian/return", { borrowId: borrowToReturn });
      
      if (res.data.fine) {
        showWarning(`${res.data.message} - Fine: Rs ${res.data.fine}`);
      } else {
        showSuccess(res.data.message);
      }
      
      fetchActiveBorrows();
    } catch (err) {
      showError(err.response?.data?.error || "Error processing return");
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
            <Link
              to="/librarian/return-book"
              className="hover:underline font-semibold transition border-b-2 border-white"
            >
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
        <div>
          <h2 className="text-3xl font-bold text-[#8b0000]">📥 Return Book</h2>
          <p className="text-gray-600 mt-1">Process book returns and calculate fines</p>
        </div>

        {/* Active Borrows Table */}
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
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {activeBorrows.map((borrow) => {
                  const dueDate = new Date(borrow.DUE_DATE);
                  const today = new Date();
                  const isOverdue = today > dueDate;

                  return (
                    <tr key={borrow.BORROW_ID} className="border-t border-gray-200 hover:bg-gray-50 transition">
                      <td className="p-4">{borrow.BORROW_ID}</td>
                      <td className="p-4 font-semibold">{borrow.STUDENT_NAME}</td>
                      <td className="p-4">{borrow.ERP_ID}</td>
                      <td className="p-4">{borrow.BOOK_TITLE}</td>
                      <td className="p-4">{new Date(borrow.ISSUE_DATE).toLocaleDateString()}</td>
                      <td className="p-4">{dueDate.toLocaleDateString()}</td>
                      <td className="p-4">
                        {isOverdue ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            Overdue
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            On Time
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleReturn(borrow.BORROW_ID)}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm font-semibold"
                        >
                          Return
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {activeBorrows.length === 0 && (
            <div className="p-12 text-center text-gray-600">
              <p className="text-lg">No active borrows</p>
              <p className="text-sm mt-2">All books have been returned</p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">ℹ️ How It Works</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Click "Return" to process a book return</li>
            <li>• If returned late, a fine will be automatically calculated (Rs 10/day)</li>
            <li>• Available copies will be automatically incremented</li>
            <li>• Student's fine_due will be updated automatically</li>
            <li>• Overdue books are highlighted in red</li>
          </ul>
        </div>
      </main>

      {/* Return Confirmation Modal */}
      <ConfirmModal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onConfirm={confirmReturn}
        title="Process Return"
        message="Are you sure you want to process this book return? Late fees will be calculated automatically if overdue."
        confirmText="Process Return"
        cancelText="Cancel"
      />
    </div>
  );
}
