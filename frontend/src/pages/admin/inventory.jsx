import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";

export default function Inventory() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get("/admin/inventory");
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.TITLE.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.AUTHOR.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.GENRE?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold">📖 Books Inventory</h1>
        </div>
        <button
          onClick={logout}
          className="bg-white text-iba-red font-semibold px-4 py-1 rounded hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </header>

      <main className="p-8">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title, author, or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-iba-red focus:outline-none"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <p className="text-sm text-gray-600">Total Books</p>
            <p className="text-3xl font-bold text-iba-red">{books.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <p className="text-sm text-gray-600">Out of Stock</p>
            <p className="text-3xl font-bold text-red-600">
              {books.filter((b) => b.AVAILABLE_COPIES === 0).length}
            </p>
          </div>
        </div>

        {/* Books Table */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          {loading ? (
            <p className="text-center text-gray-600">Loading inventory...</p>
          ) : filteredBooks.length === 0 ? (
            <p className="text-center text-gray-600">No books found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-iba-red text-white">
                  <tr>
                    <th className="p-3">Book ID</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Author</th>
                    <th className="p-3">Genre</th>
                    <th className="p-3">Year</th>
                    <th className="p-3">Available Copies</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr
                      key={book.BOOK_ID}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-3">{book.BOOK_ID}</td>
                      <td className="p-3 font-semibold">{book.TITLE}</td>
                      <td className="p-3">{book.AUTHOR}</td>
                      <td className="p-3">{book.GENRE || "-"}</td>
                      <td className="p-3">{book.YEAR_PUBLISHED || "-"}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            book.AVAILABLE_COPIES === 0
                              ? "bg-red-100 text-red-700"
                              : book.AVAILABLE_COPIES < 5
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {book.AVAILABLE_COPIES}
                        </span>
                      </td>
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
