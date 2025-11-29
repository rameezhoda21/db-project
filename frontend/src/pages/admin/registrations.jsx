import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";

export default function Registrations() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await api.get("/admin/registrations");
      setRegistrations(res.data);
    } catch (err) {
      console.error("Error fetching registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await api.post(`/admin/registrations/${id}/approve`);
      setMessage(res.data.message);
      fetchRegistrations();
    } catch (err) {
      setMessage("Error approving registration");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await api.post(`/admin/registrations/${id}/reject`);
      setMessage(res.data.message);
      fetchRegistrations();
    } catch (err) {
      setMessage("Error rejecting registration");
    }
  };

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
          <h1 className="text-2xl font-bold">✅ Registrations</h1>
        </div>
        <button
          onClick={logout}
          className="bg-white text-iba-red font-semibold px-4 py-1 rounded hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </header>

      <main className="p-8">
        {/* Message */}
        {message && (
          <div className="bg-blue-100 text-blue-800 border border-blue-300 px-4 py-3 rounded-md mb-6">
            {message}
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-blue-800 text-lg mb-2">
            ℹ️ Registration Approval System
          </h3>
          <p className="text-blue-700">
            Review and approve/reject registration requests from students and librarians.
            Once approved, users will be able to log in with their email and password.
          </p>
        </div>

        {/* Registrations Table */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-iba-red mb-4">
            Pending Registration Requests
          </h2>
          {loading ? (
            <p className="text-center text-gray-600">Loading registrations...</p>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600 text-lg">No pending registrations at this time.</p>
              <p className="text-gray-500 text-sm mt-2">
                New signup requests will appear here once registration is implemented.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-iba-red text-white">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">ERP ID</th>
                    <th className="p-3">Requested On</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr
                      key={reg.USER_ID}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-3">{reg.USER_ID}</td>
                      <td className="p-3 font-semibold">
                        {reg.FIRST_NAME} {reg.LAST_NAME}
                      </td>
                      <td className="p-3">{reg.EMAIL}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            reg.ROLE === "student"
                              ? "bg-green-100 text-green-700"
                              : reg.ROLE === "librarian"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {reg.ROLE}
                        </span>
                      </td>
                      <td className="p-3">
                        {reg.ROLE === "student" ? (
                          <span className="font-mono font-semibold text-iba-red">
                            {reg.ERP_ID || "N/A"}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-3">
                        {new Date(reg.CREATED_AT).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(reg.USER_ID)}
                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 font-semibold"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleReject(reg.USER_ID)}
                            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 font-semibold"
                          >
                            ✗ Reject
                          </button>
                        </div>
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
