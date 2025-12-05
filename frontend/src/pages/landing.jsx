import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="bg-iba-light min-h-screen text-iba-dark flex flex-col">
      {/* 🔴 Navbar */}
      <nav className="flex justify-between items-center bg-iba-red text-white px-8 py-4 shadow-md">
        <h1 className="text-2xl font-bold tracking-wide">IBA Library System</h1>
        <div className="space-x-6 text-sm font-semibold hidden md:flex">
          <a href="#about" className="hover:text-gray-200 transition">About</a>
          <a href="#services" className="hover:text-gray-200 transition">Services</a>
          <a href="#contact" className="hover:text-gray-200 transition">Contact</a>
        </div>
        <Link
          to="/login"
          className="bg-white text-iba-red font-semibold px-5 py-2 rounded-md hover:bg-gray-100 transition"
        >
          Login
        </Link>
      </nav>

      {/* 🏫 Hero Section */}
      <header className="flex flex-col items-center justify-center text-center px-6 py-16 md:py-24 bg-gradient-to-b from-iba-light to-white">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Welcome to the IBA Library
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mb-8">
          Empowering students and faculty with access to thousands of books,
          journals, and digital resources — anytime, anywhere.
        </p>

        {/* 🔍 Browse Books Button */}
        <Link
          to="/books"
          className="bg-iba-red text-white font-semibold px-8 py-4 rounded-md hover:bg-iba-dark transition shadow-lg text-lg"
        >
          Search Books
        </Link>
      </header>

      {/* 📖 About Section */}
      <section id="about" className="py-16 px-6 md:px-20 bg-white">
        <h3 className="text-3xl font-bold text-iba-red mb-6 text-center">About Us</h3>
        <p className="max-w-3xl mx-auto text-center text-gray-700 leading-relaxed">
          The IBA Library is one of the oldest and most resourceful academic libraries
          in Pakistan. With a growing collection of over 50,000 books, 200 journals, and
          access to leading digital databases, our goal is to support learning,
          research, and innovation across disciplines.
        </p>
        <div className="flex flex-wrap justify-center gap-8 mt-12">
          <div className="w-64 bg-iba-light border border-gray-200 shadow-sm rounded-lg p-6 text-center">
            <h4 className="font-semibold text-lg mb-2">📚 Vast Collection</h4>
            <p className="text-gray-600">Thousands of physical and digital books accessible to all users.</p>
          </div>
          <div className="w-64 bg-iba-light border border-gray-200 shadow-sm rounded-lg p-6 text-center">
            <h4 className="font-semibold text-lg mb-2">🧑‍💻 Digital Resources</h4>
            <p className="text-gray-600">Access e-journals, e-books, and research papers through our online databases.</p>
          </div>
          <div className="w-64 bg-iba-light border border-gray-200 shadow-sm rounded-lg p-6 text-center">
            <h4 className="font-semibold text-lg mb-2">🏛 Study Facilities</h4>
            <p className="text-gray-600">Modern study spaces equipped with Wi-Fi and discussion rooms.</p>
          </div>
        </div>
      </section>

      {/* 💼 Services Section */}
      <section id="services" className="py-16 px-6 md:px-20 bg-iba-light">
        <h3 className="text-3xl font-bold text-iba-red mb-6 text-center">Library Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
            <h4 className="font-semibold text-xl mb-2">Borrow & Reserve</h4>
            <p className="text-gray-600">
              Students can easily borrow or reserve books online through their account dashboard.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
            <h4 className="font-semibold text-xl mb-2">Research Assistance</h4>
            <p className="text-gray-600">
              Our librarians provide personalized help with citations, sources, and research queries.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
            <h4 className="font-semibold text-xl mb-2">Digital Access</h4>
            <p className="text-gray-600">
              Access global online databases, e-journals, and digital archives 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* 📞 Contact Section */}
      <section id="contact" className="py-16 px-6 md:px-20 bg-white">
        <h3 className="text-3xl font-bold text-iba-red mb-6 text-center">Contact Us</h3>
        <div className="max-w-3xl mx-auto text-center text-gray-700">
          <p>📍 IBA Main Campus, University Road, Karachi, Pakistan</p>
          <p>📧 library@iba.edu.pk</p>
          <p>📞 +92 (21) 38104700</p>
        </div>
      </section>

      {/* ⚙️ Footer */}
      <footer className="bg-iba-red text-white py-4 text-center text-sm">
        © {new Date().getFullYear()} IBA Library System | All Rights Reserved
      </footer>
    </div>
  );
}
