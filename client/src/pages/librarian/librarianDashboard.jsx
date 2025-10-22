import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";

export default function LibrarianDashboard() {
  const { user, logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: "", author: "", copies: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const res = await api.get("/student/books");
    setBooks(res.data);
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author || !newBook.copies) return;
    const res = await api.post("/librarian/add", newBook);
    setMessage(res.data.message);
    setNewBook({ title: "", author: "", copies: "" });
    fetchBooks();
  };

  const handleRemove = async (id) => {
    await api.delete(`/librarian/remove/${id}`);
    setMessage("Book removed successfully");
    fetchBooks();
  };

  return (
    <div className="min-h-screen bg-iba-light text-iba-dark">
      {/* Navbar */}
      <header className="bg-iba-red text-white py-4 px-8 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">📖 Librarian Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {user?.name || "Librarian"}</span>
          <button
            onClick={logout}
            className="bg-white text-iba-red font-semibold px-4 py-1 rounded hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-8 space-y-10">
        {/* Message */}
        {message && (
          <div className="bg-green-100 text-green-800 border border-green-300 px-4 py-2 rounded-md text-center">
            {message}
          </div>
        )}

        {/* Add New Book Section */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-iba-red mb-4">
            ➕ Add New Book
          </h2>
          <form
            onSubmit={handleAddBook}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <input
              type="text"
              placeholder="Book Title"
              className="p-2 border rounded-md focus:ring-2 focus:ring-iba-red outline-none"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Author"
              className="p-2 border rounded-md focus:ring-2 focus:ring-iba-red outline-none"
              value={newBook.author}
              onChange={(e) =>
                setNewBook({ ...newBook, author: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Copies"
              className="p-2 border rounded-md focus:ring-2 focus:ring-iba-red outline-none"
              value={newBook.copies}
              onChange={(e) =>
                setNewBook({ ...newBook, copies: e.target.value })
              }
            />
            <button
              type="submit"
              className="bg-iba-red text-white font-semibold rounded-md hover:bg-iba-dark transition"
            >
              Add Book
            </button>
          </form>
        </section>

        {/* Book Inventory */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-iba-red mb-4">
            📚 Current Book Inventory
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-gray-200">
              <thead className="bg-iba-red text-white">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Copies</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr
                    key={book.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-3">{book.id}</td>
                    <td className="p-3 font-semibold">{book.title}</td>
                    <td className="p-3">{book.author}</td>
                    <td className="p-3">{book.copies}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700">
                          Issue
                        </button>
                        <button className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600">
                          Return
                        </button>
                        <button
                          onClick={() => handleRemove(book.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
