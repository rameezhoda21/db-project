import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function PublicBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/books")
      .then((res) => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load books");
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-iba-light min-h-screen text-iba-dark flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-iba-red text-white px-8 py-4 shadow-md">
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-gray-200 transition">
          IBA Library System
        </Link>
        <Link
          to="/login"
          className="bg-white text-iba-red font-semibold px-5 py-2 rounded-md hover:bg-gray-100 transition"
        >
          Login
        </Link>
      </nav>

      {/* Main Content */}
      <div className="flex-grow p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-iba-red mb-2">
            Book Inventory
          </h1>
          <p className="text-gray-600 mb-8">
            Browse our complete collection of books. Login to borrow books.
          </p>

          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading books...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {!loading && !error && books.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No books available in the library.</p>
            </div>
          )}

          {!loading && !error && books.length > 0 && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-iba-red text-white">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold">Book ID</th>
                      <th className="py-3 px-4 text-left font-semibold">Title</th>
                      <th className="py-3 px-4 text-left font-semibold">Author</th>
                      <th className="py-3 px-4 text-left font-semibold">Genre</th>
                      <th className="py-3 px-4 text-left font-semibold">Year Published</th>
                      <th className="py-3 px-4 text-left font-semibold">Available Copies</th>
                      <th className="py-3 px-4 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book, index) => (
                      <tr
                        key={book.BOOK_ID || index}
                        className="border-t border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="py-3 px-4 text-sm">{book.BOOK_ID}</td>
                        <td className="py-3 px-4 font-medium">{book.TITLE}</td>
                        <td className="py-3 px-4 text-gray-700">{book.AUTHOR}</td>
                        <td className="py-3 px-4 text-gray-600">{book.GENRE || "N/A"}</td>
                        <td className="py-3 px-4 text-gray-600">{book.YEAR_PUBLISHED || "N/A"}</td>
                        <td className="py-3 px-4 text-center">{book.AVAILABLE_COPIES}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              book.AVAILABLE_COPIES > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {book.AVAILABLE_COPIES > 0 ? "Available" : "Unavailable"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="inline-block bg-iba-red text-white font-semibold px-6 py-3 rounded-md hover:bg-iba-dark transition"
            >
              Login to Borrow Books
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-iba-red text-white py-4 text-center text-sm">
        © {new Date().getFullYear()} IBA Library System | All Rights Reserved
      </footer>
    </div>
  );
}
