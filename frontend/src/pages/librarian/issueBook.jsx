import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";
import { showSuccess, showError } from "../../utils/toast";

export default function IssueBook() {
  const { logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [erpId, setErpId] = useState("");
  const [bookId, setBookId] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/librarian/books");
      setBooks(res.data.filter(book => book.AVAILABLE_COPIES > 0));
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    
    try {
      const res = await api.post("/librarian/issue", {
        erpId: parseInt(erpId),
        bookId: parseInt(bookId),
      });
      
      showSuccess(res.data.message);
      setErpId("");
      setBookId("");
      fetchBooks();
    } catch (err) {
      showError(err.response?.data?.error || "Error issuing book");
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
            <Link
              to="/librarian/issue-book"
              className="hover:underline font-semibold transition border-b-2 border-white"
            >
              Issue Book
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
        <div>
          <h2 className="text-3xl font-bold text-[#8b0000]">📤 Issue Book to Student</h2>
          <p className="text-gray-600 mt-1">Enter student ERP ID and select a book</p>
        </div>

        {/* Issue Form */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <form onSubmit={handleIssue} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Student ERP ID *</label>
              <input
                type="number"
                required
                value={erpId}
                onChange={(e) => setErpId(e.target.value)}
                placeholder="Enter student ERP (e.g., 22001)"
                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#8b0000] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Select Book *</label>
              <select
                required
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#8b0000] outline-none"
              >
                <option value="">-- Select a book --</option>
                {books.map((book) => (
                  <option key={book.BOOK_ID} value={book.BOOK_ID}>
                    {book.TITLE} by {book.AUTHOR} ({book.AVAILABLE_COPIES} available)
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#8b0000] text-white py-3 rounded-md font-semibold hover:bg-[#a81818] transition"
            >
              Issue Book
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">ℹ️ How It Works</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Enter the student's ERP ID (numeric, e.g., 22001)</li>
            <li>• Select a book from available books</li>
            <li>• Due date will be automatically calculated (14 days)</li>
            <li>• Available copies will be automatically decremented</li>
            <li>• Students with outstanding fines cannot borrow books</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
