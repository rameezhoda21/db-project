import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [fine, setFine] = useState(50); // Mock fine for now

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const res = await api.get("/student/books");
    setBooks(res.data);
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleBorrow = async (id) => {
    const res = await api.post(`/student/borrow/${id}`);
    setMessage(res.data.message);
    fetchBooks();
  };

  const handleReserve = async (id) => {
    const res = await api.post(`/student/reserve/${id}`);
    setMessage(res.data.message);
  };

  const handlePayFine = async () => {
    await api.post("/student/payfine");
    setFine(0);
    setMessage("Fine paid successfully!");
  };

  return (
    <div className="min-h-screen bg-iba-light text-iba-dark">
      {/* Navbar */}
      <header className="bg-iba-red text-white py-4 px-8 flex justify-between items-center shadow-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold">🎓 Student Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {user?.name || "Student"}</span>
          <button
            onClick={logout}
            className="bg-white text-iba-red font-semibold px-4 py-1 rounded hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-8 space-y-10">
        {/* Notifications */}
        {message && (
          <div className="bg-green-100 text-green-800 border border-green-300 px-4 py-2 rounded-md text-center">
            {message}
          </div>
        )}

        {/* Search + Fine Section */}
        <section className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="w-full md:w-1/2">
            <input
              type="text"
              placeholder="🔍 Search by book title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-iba-red focus:outline-none"
            />
          </div>
          <div className="bg-white shadow-md border border-gray-200 p-4 rounded-lg flex items-center gap-6">
            <div>
              <h3 className="font-bold text-lg text-iba-red">Outstanding Fine</h3>
              <p className="text-gray-700 text-sm">
                {fine > 0 ? `₨ ${fine} due` : "No outstanding fines!"}
              </p>
            </div>
            {fine > 0 && (
              <button
                onClick={handlePayFine}
                className="bg-iba-red text-white px-4 py-2 rounded-md hover:bg-iba-dark transition"
              >
                Pay Fine
              </button>
            )}
          </div>
        </section>

        {/* Book Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-iba-red">
            📚 Available Books
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <h3 className="text-lg font-bold text-iba-red mb-1">
                  {book.title}
                </h3>
                <p className="text-gray-600 mb-2 italic">{book.author}</p>
                <p
                  className={`font-semibold ${
                    book.copies > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {book.copies > 0 ? "Available" : "All Copies Borrowed"}
                </p>

                <div className="flex justify-between mt-4">
                  {book.copies > 0 ? (
                    <button
                      onClick={() => handleBorrow(book.id)}
                      className="bg-iba-red text-white px-4 py-2 rounded-md hover:bg-iba-dark transition"
                    >
                      Borrow
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReserve(book.id)}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                    >
                      Reserve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <p className="text-center text-gray-600 mt-6">
              No books found for “{search}”.
            </p>
          )}
        </section>

        {/* Borrowed Books Section (Mock) */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-iba-red mb-4">
            📖 Your Borrowed Books
          </h2>
          <table className="w-full border border-gray-200 text-left">
            <thead className="bg-iba-red text-white">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="p-3 font-semibold">Database Systems</td>
                <td className="p-3">Nov 5, 2025</td>
                <td className="p-3 text-green-600 font-medium">On Time</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="p-3 font-semibold">Operating Systems</td>
                <td className="p-3">Oct 22, 2025</td>
                <td className="p-3 text-red-600 font-medium">Overdue</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
