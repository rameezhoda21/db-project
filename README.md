# 📚 IBA Library Management System

A comprehensive library management system built with React, Node.js, Express, and Oracle Database.

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v14 or higher)
- Oracle Database (XE or higher)
- Oracle Instant Client (if needed)

---

## 📦 Installation

### 1. Database Setup

1. **Open Oracle SQL Developer** and connect with your credentials

2. **Run the following SQL files in order** (from the `database/` folder):
   - `00_drop_all.sql` - Cleans up any existing tables
   - `00_sequences.sql` - Creates sequences for auto-incrementing IDs
   - `01_create_tables.sql` - Creates all tables
   - `02_views_oracle.sql` - Creates database views
   - `03_triggers.sql` - Creates triggers for business logic
   - `04_login_credentials.sql` - Creates default user accounts
   - `05_authentication.sql` - Sets up authentication procedures

3. **To run each file**:
   - Open the SQL file in SQL Developer
   - Press **F5** (Run Script) or click the "Run Script" button
   - Wait for "PL/SQL procedure successfully completed" message
   - Move to the next file

This will create all tables, triggers, views, and default user accounts for the system.

---

### 2. Backend Setup

1. **Navigate to backend**:
   ```powershell
   cd backend
   ```

2. **Install dependencies**:
   ```powershell
   npm install
   ```

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Update with your Oracle credentials
   - Add Gmail credentials for password reset emails (optional)

4. **Start the server**:
   ```powershell
   npm run dev
   ```

Backend will run on: `http://localhost:5000`

---

### 3. Frontend Setup

1. **Navigate to frontend**:
   ```powershell
   cd frontend
   ```

2. **Install dependencies**:
   ```powershell
   npm install
   ```

3. **Start the development server**:
   ```powershell
   npm start
   ```

Frontend will run on: `http://localhost:3000`

---

## 👥 Default Login Credentials

### Student
- **Email**: `hasan.imam@khi.iba.edu.pk`
- **Password**: `12345678`

### Librarian
- **Email**: `librarian@gmail.com`
- **Password**: `12345678`

### Admin
- **Email**: `admin@gmail.com`
- **Password**: `12345678`

---

## ✨ Features

### For Students
- 🔍 Browse and search books
- 📖 Request to borrow books
- 📚 View borrowed books and due dates
- 💰 Check fines and payment status

### For Librarians
- ✅ Approve/reject borrow requests
- 📥 Process book returns
- 📚 Manage book inventory (add/edit/delete)
- 💵 Calculate late fines automatically

### For Admins
- 👥 Approve user registrations
- 📊 View all borrow transactions
- 📖 Manage complete book inventory
- 💰 Process fine payments
- 🔐 System configuration

---

## 🧪 Testing

For testing fine functionality and overdue books, see [FINE_TESTING.md](./FINE_TESTING.md)

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, React Router, React Toastify
- **Backend**: Node.js, Express.js
- **Database**: Oracle Database with PL/SQL triggers
- **Authentication**: JWT tokens, bcrypt password hashing
- **Email**: Nodemailer with Gmail

---

## 📝 Notes

- Make sure Oracle Database service is running before starting the app
- If you encounter connection issues, check your Oracle credentials in `.env`
- For password reset functionality, configure Gmail app password in `.env`

---

## 🤝 Support

For issues or questions, contact the development team.
