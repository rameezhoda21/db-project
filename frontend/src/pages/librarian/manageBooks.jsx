import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";
import { showSuccess, showError } from "../../utils/toast";
import ConfirmModal from "../../components/ConfirmModal";

export default function ManageBooks() {
  const { logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    yearPublished: "",
    copies: "",
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/librarian/books");
      setBooks(res.data);
    } catch (err) {
      showError("Error loading books");
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/librarian/books", newBook);
      showSuccess(res.data.message);
      setNewBook({
        title: "",
        author: "",
        genre: "",
        yearPublished: "",
        copies: "",
      });
      setShowAddModal(false);
      fetchBooks();
    } catch (err) {
      showError("Error adding book");
    }
  };

  const handleDeleteBook = (bookId) => {
    setBookToDelete(bookId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await api.delete(`/librarian/books/${bookToDelete}`);
      showSuccess(res.data.message);
      fetchBooks();
    } catch (err) {
      console.error("Error deleting book:", err);
      showError(err.response?.data?.error || "Error deleting book");
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
            <Link
              to="/librarian/manage-books"
              className="hover:underline font-semibold transition border-b-2 border-white"
            >
              Manage Books
            </Link>
            <Link to="/librarian/issue-requests" className="hover:underline font-semibold transition">
              Issue Requests
            </Link>
            <Link to="/librarian/return-book" className="hover:underline font-semibold transition">
              Return Book
            </Link>
            <Link to="/librarian/borrows" className="hover:underline font-semibold transition">
              View Borrows
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
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#8b0000]">📚 Manage Books</h2>
            <p className="text-gray-600 mt-1">Add, edit, or remove books from inventory</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#8b0000] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#a81818] transition"
          >
            + Add New Book
          </button>
        </div>

        {/* Books Table */}
        <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#8b0000] text-white">
                <tr>
                  <th className="p-4 text-left font-semibold">ID</th>
                  <th className="p-4 text-left font-semibold">Title</th>
                  <th className="p-4 text-left font-semibold">Author</th>
                  <th className="p-4 text-left font-semibold">Genre</th>
                  <th className="p-4 text-left font-semibold">Year</th>
                  <th className="p-4 text-left font-semibold">Available</th>
                  <th className="p-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.BOOK_ID} className="border-t border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-4">{book.BOOK_ID}</td>
                    <td className="p-4 font-semibold text-gray-800">{book.TITLE}</td>
                    <td className="p-4 text-gray-600">{book.AUTHOR}</td>
                    <td className="p-4 text-gray-600">{book.GENRE}</td>
                    <td className="p-4 text-gray-600">{book.YEAR_PUBLISHED}</td>
                    <td className="p-4 font-semibold text-green-600">{book.AVAILABLE_COPIES}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteBook(book.BOOK_ID)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {books.length === 0 && (
            <div className="p-12 text-center text-gray-600">
              <p className="text-lg">No books in inventory</p>
              <p className="text-sm mt-2">Click "Add New Book" to get started</p>
            </div>
          )}
        </div>
      </main>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
            <h3 className="text-2xl font-bold text-[#8b0000] mb-6">Add New Book</h3>
            <form onSubmit={handleAddBook} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8b0000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Author *</label>
                  <input
                    type="text"
                    required
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8b0000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Genre *</label>
                  <input
                    type="text"
                    required
                    value={newBook.genre}
                    onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8b0000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Year Published *</label>
                  <input
                    type="number"
                    required
                    value={newBook.yearPublished}
                    onChange={(e) => setNewBook({ ...newBook, yearPublished: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8b0000] outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Number of Copies *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newBook.copies}
                    onChange={(e) => setNewBook({ ...newBook, copies: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8b0000] outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-[#8b0000] text-white py-2 rounded-md font-semibold hover:bg-[#a81818] transition"
                >
                  Add Book
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Book"
        message="Are you sure you want to delete this book? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
