import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function BrowseBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    api.get("/books").then((res) => setBooks(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Browse Books</h1>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Title</th>
            <th className="py-2 px-4 text-left">Author</th>
            <th className="py-2 px-4 text-left">Availability</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b, i) => (
            <tr key={i} className="border-t hover:bg-gray-100">
              <td className="py-2 px-4">{b.TITLE}</td>
              <td className="py-2 px-4">{b.AUTHOR}</td>
              <td className="py-2 px-4">
                {b.COPIES_AVAILABLE > 0 ? "Available" : "Unavailable"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
