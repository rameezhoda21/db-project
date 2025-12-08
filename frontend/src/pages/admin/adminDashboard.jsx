import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: "View Borrows",
      description: "See all borrowing transactions",
      icon: "📚",
      path: "/admin/borrows",
      color: "bg-blue-500",
    },
    {
      title: "Books Inventory",
      description: "Manage library book collection",
      icon: "📖",
      path: "/admin/inventory",
      color: "bg-green-500",
    },
    {
      title: "Registrations",
      description: "Approve/reject new user signups",
      icon: "✅",
      path: "/admin/registrations",
      color: "bg-yellow-500",
    },
    {
      title: "Manage Fines",
      description: "Process student fine payments",
      icon: "💰",
      path: "/admin/manage-fines",
      color: "bg-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-iba-light text-iba-dark">
      {/* Navbar */}
      <header className="bg-iba-red text-white py-4 px-8 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">🔐 Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {user?.firstName || user?.FIRST_NAME || "Admin"}</span>
          <button
            onClick={logout}
            className="bg-white text-iba-red font-semibold px-4 py-1 rounded hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-8">
        <h2 className="text-3xl font-bold text-iba-red mb-8">System Overview</h2>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all transform hover:scale-105 border-t-4 border-iba-red"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{card.icon}</span>
                <div className={`${card.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold`}>
                  →
                </div>
              </div>
              <h3 className="text-xl font-bold text-iba-dark mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </div>
          ))}
        </div>


      </main>
    </div>
  );
}
