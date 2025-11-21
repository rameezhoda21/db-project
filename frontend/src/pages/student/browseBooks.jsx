import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";

export default function BrowseBooks() {
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const { user } = useAuth();

  useEffect(() => {
    api.get("/books").then((res) => setBooks(res.data));
  }, []);

  const handleReserve = async (bookId) => {
    if (!user?.ERP_ID) {
      setMessage("Error: Not logged in");
      setMessageType("error");
      return;
    }

    try {
      const res = await api.post(`/student/reserve/${bookId}`, {
        erp_id: user.ERP_ID,
      });
      setMessage(res.data?.message || "Reserved successfully");
      setMessageType("success");
      // Refresh list
      const updated = await api.get("/books");
      setBooks(updated.data);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error reserving book");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Browse Books</h1>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Title</th>
            <th className="py-2 px-4 text-left">Author</th>
            <th className="py-2 px-4 text-left">Availability</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b, i) => (
            <tr key={i} className="border-t hover:bg-gray-100">
              <td className="py-2 px-4">{b.TITLE}</td>
              <td className="py-2 px-4">{b.AUTHOR}</td>
              <td className="py-2 px-4">
                {b.AVAILABLE_COPIES > 0 ? `${b.AVAILABLE_COPIES} available` : `Unavailable — ${b.RESERVATION_COUNT || 0} reserved`}
              </td>
              <td className="py-2 px-4">
                {b.AVAILABLE_COPIES > 0 ? (
                  <span className="text-sm text-green-600 font-semibold">Available</span>
                ) : (
                  <button
                    onClick={() => handleReserve(b.BOOK_ID)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Reserve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Floating toast */}
      {message && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-2 rounded shadow-lg ${messageType === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          {message}
        </div>
      )}
    </div>
  );
}
