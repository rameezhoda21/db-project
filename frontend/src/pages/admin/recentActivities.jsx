import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";

export default function RecentActivities() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await api.get("/admin/recent-activities");
      setActivities(res.data);
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter((a) => {
    if (filter === "all") return true;
    return a.ACTIVITY_TYPE === filter;
  });

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
          <h1 className="text-2xl font-bold">📊 Recent Activities</h1>
        </div>
        <button
          onClick={logout}
          className="bg-white text-iba-red font-semibold px-4 py-1 rounded hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </header>

      <main className="p-8">
        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              filter === "all"
                ? "bg-iba-red text-white"
                : "bg-white text-iba-dark border border-gray-300 hover:bg-gray-50"
            }`}
          >
            All ({activities.length})
          </button>
          <button
            onClick={() => setFilter("BORROW")}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              filter === "BORROW"
                ? "bg-iba-red text-white"
                : "bg-white text-iba-dark border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Borrows ({activities.filter((a) => a.ACTIVITY_TYPE === "BORROW").length})
          </button>
          <button
            onClick={() => setFilter("FINE")}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              filter === "FINE"
                ? "bg-iba-red text-white"
                : "bg-white text-iba-dark border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Fines ({activities.filter((a) => a.ACTIVITY_TYPE === "FINE").length})
          </button>
        </div>

        {/* Activities Feed */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          {loading ? (
            <p className="text-center text-gray-600">Loading activities...</p>
          ) : filteredActivities.length === 0 ? (
            <p className="text-center text-gray-600">No recent activities found.</p>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      activity.ACTIVITY_TYPE === "BORROW"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {activity.ACTIVITY_TYPE === "BORROW" ? "📚" : "💰"}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-iba-dark">
                          {activity.ACTIVITY_TYPE === "BORROW"
                            ? "Book Borrow Activity"
                            : "Fine Applied"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">{activity.USER_NAME}</span> (
                          {activity.USER_ROLE})
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          Book: <span className="font-semibold">{activity.BOOK_TITLE}</span>
                        </p>
                        {activity.HANDLED_BY && (
                          <p className="text-xs text-gray-500 mt-1">
                            Handled by: {activity.HANDLED_BY}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            activity.STATUS === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : activity.STATUS === "ISSUED"
                              ? "bg-blue-100 text-blue-700"
                              : activity.STATUS === "RETURNED"
                              ? "bg-green-100 text-green-700"
                              : activity.STATUS === "PAID"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {activity.STATUS}
                        </span>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(activity.ACTIVITY_DATE).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
