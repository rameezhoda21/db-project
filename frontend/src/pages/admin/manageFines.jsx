import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function ManageFines() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingFineId, setProcessingFineId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      const res = await api.get("/admin/fines");
      setFines(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch fines");
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (fineId) => {
    if (!window.confirm("Confirm that the student has paid this fine in cash?")) {
      return;
    }

    setProcessingFineId(fineId);
    try {
      await api.post(`/admin/fines/${fineId}/pay`);
      alert("Fine marked as paid successfully!");
      // Remove fine from list
      setFines(fines.filter(f => f.FINE_ID !== fineId));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to mark fine as paid");
    } finally {
      setProcessingFineId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-600">Loading fines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-iba-red">Manage Fines</h1>
            <p className="text-gray-600 mt-1">Mark student fines as paid after receiving payment</p>
          </div>
          <button
            onClick={() => navigate("/admin")}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-iba-red">{fines.length}</p>
              <p className="text-gray-600">Unpaid Fines</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-iba-red">
                Rs {fines.reduce((sum, f) => sum + (f.FINE_AMOUNT || 0), 0).toFixed(2)}
              </p>
              <p className="text-gray-600">Total Outstanding</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-iba-red">
                {new Set(fines.map(f => f.ERP_ID)).size}
              </p>
              <p className="text-gray-600">Students with Fines</p>
            </div>
          </div>
        </div>

        {/* Fines Table */}
        {fines.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">✅ No unpaid fines at the moment!</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-iba-red text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Fine ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Book
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Fine Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Days Late
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fines.map((fine) => {
                    const daysLate = Math.floor(
                      (new Date(fine.RETURN_DATE) - new Date(fine.DUE_DATE)) / (1000 * 60 * 60 * 24)
                    );
                    
                    return (
                      <tr key={fine.FINE_ID} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{fine.FINE_ID}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {fine.FIRST_NAME} {fine.LAST_NAME}
                          </div>
                          <div className="text-sm text-gray-500">ERP: {fine.ERP_ID}</div>
                          <div className="text-xs text-gray-400">{fine.EMAIL}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{fine.BOOK_TITLE}</div>
                          <div className="text-sm text-gray-500">{fine.AUTHOR}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-bold text-iba-red">
                            Rs {fine.FINE_AMOUNT}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(fine.FINE_DATE)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            {daysLate} days
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                          <button
                            onClick={() => handleMarkAsPaid(fine.FINE_ID)}
                            disabled={processingFineId === fine.FINE_ID}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${
                              processingFineId === fine.FINE_ID
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                          >
                            {processingFineId === fine.FINE_ID ? "Processing..." : "Mark as Paid"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 How to Process Fines:</h3>
          <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
            <li>Student comes to the admin office to pay their fine</li>
            <li>Verify the student's identity (ERP ID and name)</li>
            <li>Collect the fine amount in cash</li>
            <li>Click "Mark as Paid" to update the system</li>
            <li>Student's account will be cleared and they can borrow again</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
