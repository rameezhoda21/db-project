import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [borrowed, setBorrowed] = useState([]);
  const [search, setSearch] = useState("");
  const [fine, setFine] = useState(0);
  const [message, setMessage] = useState("");

  // Fetch everything once user is loaded
  useEffect(() => {
    if (user?.erp_id) {
      fetchBooks();
      fetchBorrowed();
      fetchFine();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ===== API CALLS =====
  const fetchBooks = async () => {
    try {
      const res = await api.get("/student/books");
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const fetchBorrowed = async () => {
    try {
      const res = await api.get(`/student/borrowed/${user.erp_id}`);
      setBorrowed(res.data);
    } catch (err) {
      console.error("Error fetching borrowed books:", err);
    }
  };

  const fetchFine = async () => {
    try {
      const res = await api.get(`/student/fines/${user.erp_id}`);
      setFine(res.data?.fine_due || 0);
    } catch (err) {
      console.error("Error fetching fine:", err);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      const res = await api.post(`/student/borrow/${bookId}`, {
        erp_id: user.erp_id,
      });
      setMessage(res.data.message);
      fetchBooks();
      fetchBorrowed();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error borrowing book.");
    }
  };

  const handleReserve = async (bookId) => {
    try {
      const res = await api.post(`/student/reserve/${bookId}`, {
        erp_id: user.erp_id,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error reserving book.");
    }
  };

  const handlePayFine = async () => {
    try {
      await api.post(`/student/payfine/${user.erp_id}`);
      setFine(0);
      setMessage("Fine paid successfully!");
    } catch (err) {
      setMessage("Error paying fine.");
    }
  };

  // ===== FILTER =====
  const filteredBooks = books.filter(
    (b) =>
      b.TITLE.toLowerCase().includes(search.toLowerCase()) ||
      b.AUTHOR.toLowerCase().includes(search.toLowerCase())
  );

  // ===== UI =====
  return (
    <div className="min-h-screen bg-[#fff6f6] text-[#2b2b2b]">
      {/* Navbar */}
      <header className="bg-[#8b0000] text-white py-4 px-8 flex justify-between items-center shadow-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold">🎓 Student Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {user?.first_name || "Student"}</span>
          <button
            onClick={logout}
            className="bg-white text-[#8b0000] font-semibold px-4 py-1 rounded hover:bg-gray-100 transition"
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
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#8b0000] focus:outline-none"
            />
          </div>
          <div className="bg-white shadow-md border border-gray-200 p-4 rounded-lg flex items-center gap-6">
            <div>
              <h3 className="font-bold text-lg text-[#8b0000]">Outstanding Fine</h3>
              <p className="text-gray-700 text-sm">
                {fine > 0 ? `₨ ${fine} due` : "No outstanding fines!"}
              </p>
            </div>
            {fine > 0 && (
              <button
                onClick={handlePayFine}
                className="bg-[#8b0000] text-white px-4 py-2 rounded-md hover:bg-[#a81818] transition"
              >
                Pay Fine
              </button>
            )}
          </div>
        </section>

        {/* Available Books */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-[#8b0000]">
            📚 Available Books
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.BOOK_ID}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <h3 className="text-lg font-bold text-[#8b0000] mb-1">
                  {book.TITLE}
                </h3>
                <p className="text-gray-600 mb-2 italic">{book.AUTHOR}</p>
                <p
                  className={`font-semibold ${
                    book.AVAILABLE_COPIES > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {book.AVAILABLE_COPIES > 0
                    ? `${book.AVAILABLE_COPIES} copies available`
                    : "All Copies Borrowed"}
                </p>

                <div className="flex justify-between mt-4">
                  {book.AVAILABLE_COPIES > 0 ? (
                    <button
                      onClick={() => handleBorrow(book.BOOK_ID)}
                      className="bg-[#8b0000] text-white px-4 py-2 rounded-md hover:bg-[#a81818] transition"
                    >
                      Borrow
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReserve(book.BOOK_ID)}
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

        {/* Borrowed Books */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-[#8b0000] mb-4">
            📖 Your Borrowed Books
          </h2>
          {borrowed.length > 0 ? (
            <table className="w-full border border-gray-200 text-left">
              <thead className="bg-[#8b0000] text-white">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {borrowed.map((b) => {
                  const isOverdue =
                    b.DUE_DATE && new Date(b.DUE_DATE) < new Date();
                  return (
                    <tr key={b.BORROW_ID} className="border-t border-gray-200">
                      <td className="p-3 font-semibold">{b.TITLE}</td>
                      <td className="p-3">
                        {b.DUE_DATE
                          ? new Date(b.DUE_DATE).toLocaleDateString()
                          : "—"}
                      </td>
                      <td
                        className={`p-3 font-medium ${
                          isOverdue ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {isOverdue ? "Overdue" : "On Time"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">You have no borrowed books.</p>
          )}
        </section>
      </main>
    </div>
  );
}
