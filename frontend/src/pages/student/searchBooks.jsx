import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";
import { showSuccess, showError } from "../../utils/toast";

export default function SearchBooks() {
  const { user, logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/student/books");
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
      showError("Error loading books.");
    }
  };

  const handleBorrow = async (bookId) => {
    const erpId = user?.erpId || user?.ERP_ID;
    if (!erpId) {
      showError("Error: Not logged in");
      return;
    }

    try {
      const res = await api.post("/student/borrow", {
        erp_id: erpId,
        book_id: bookId,
      });
      showSuccess(res.data.message);
    } catch (err) {
      console.error("Error creating borrow request:", err);
      showError(
        err.response?.data?.error || "Error creating request. You may have unpaid fines."
      );
    }
  };

  // Filter books by search query
  const filteredBooks = books.filter(
    (b) =>
      b.TITLE?.toLowerCase().includes(search.toLowerCase()) ||
      b.AUTHOR?.toLowerCase().includes(search.toLowerCase()) ||
      b.GENRE?.toLowerCase().includes(search.toLowerCase())
  );

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
              className="hover:underline font-semibold transition border-b-2 border-white"
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
        {/* Page Title */}
        <div>
          <h2 className="text-3xl font-bold text-[#8b0000]">📚 Search Books</h2>
          <p className="text-gray-600 mt-1">
            Browse and search through our library collection
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <input
            type="text"
            placeholder="🔍 Search by title, author, or genre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#8b0000] focus:outline-none text-lg"
          />
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.BOOK_ID}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold text-[#8b0000] mb-1 line-clamp-2">
                  {book.TITLE}
                </h3>
                <p className="text-gray-600 text-sm italic mb-2">{book.AUTHOR}</p>
                <p className="text-gray-500 text-xs">Genre: {book.GENRE || 'N/A'}</p>
                {book.YEAR_PUBLISHED && (
                  <p className="text-gray-500 text-xs">
                    Published: {book.YEAR_PUBLISHED}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <p
                  className={`text-sm font-semibold ${
                    book.AVAILABLE_COPIES > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {book.AVAILABLE_COPIES > 0
                    ? `${book.AVAILABLE_COPIES} available`
                    : "All copies borrowed"}
                </p>
              </div>

              <button
                onClick={() => handleBorrow(book.BOOK_ID)}
                disabled={book.AVAILABLE_COPIES === 0}
                className={`w-full py-2 rounded-md font-semibold transition ${
                  book.AVAILABLE_COPIES > 0
                    ? "bg-[#8b0000] text-white hover:bg-[#a81818]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {book.AVAILABLE_COPIES > 0 ? "Borrow" : "Unavailable"}
              </button>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredBooks.length === 0 && (
          <div className="bg-white shadow-md rounded-lg p-12 text-center border border-gray-200">
            <p className="text-gray-600 text-lg">
              {search
                ? `No books found for "${search}"`
                : "No books available in the library."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
