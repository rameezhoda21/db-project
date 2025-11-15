# Library Management System (LMS)

A full-stack library management system built with React, Express, and Oracle Database.

## 📁 Project Structure

```
db-project/
├── backend/           # Express.js server with Oracle DB
├── frontend/          # React application
├── database/          # SQL scripts (schema, triggers, views)
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- Oracle Database (19c or later)
- npm or yarn

### Installation

#### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
DB_USER=your_oracle_username
DB_PASSWORD=your_password
DB_CONNECT_STRING=localhost:1521/orcl
```

Start the backend server:

```bash
npm run dev    # Development with nodemon
npm start      # Production
```

Server runs on `http://localhost:5000`

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

## 🎯 Features

### For Students
- Browse available books
- Borrow and reserve books
- View borrowed books history
- Pay fines online

### For Librarians
- Add/Remove books from inventory
- View borrowed and overdue books
- Issue fines to students
- Manage book availability

### For Admins
- Add/Remove librarians
- Add/Remove students
- View complete inventory
- System-wide management

## 🗃️ Database

The system uses Oracle Database with:
- Tables: STUDENTS, LIBRARIAN, ADMIN, BOOKS, BORROW, RESERVATIONS, FINE
- Views: AvailableBooks, BorrowedBooks, Overdue_Borrows
- Triggers for automatic stock management and fine calculations

## 🔐 Authentication

Three user roles with separate login endpoints:
- Students (ERP ID + Password)
- Librarians (Username + Password)
- Admins (Username + Password)

## 📝 API Endpoints

### Authentication
- `POST /api/auth/student` - Student login
- `POST /api/auth/librarian` - Librarian login
- `POST /api/auth/admin` - Admin login

### Student Routes
- `GET /api/student/books` - Get available books
- `POST /api/student/borrow` - Borrow a book
- `POST /api/student/reserve` - Reserve a book
- `GET /api/student/borrowed/:erp_id` - Get borrowed books
- `GET /api/student/fines/:erp_id` - Get outstanding fines
- `POST /api/student/payfine/:erp_id` - Pay fines

### Librarian Routes
- `GET /api/librarian/books` - Get all books
- `POST /api/librarian/add` - Add new book
- `DELETE /api/librarian/remove/:id` - Remove book
- `GET /api/librarian/borrowed` - View borrowed books
- `GET /api/librarian/overdue` - View overdue books
- `POST /api/librarian/fine` - Issue fine

### Admin Routes
- `POST /api/admin/addlibrarian` - Add librarian
- `DELETE /api/admin/removelibrarian/:id` - Remove librarian
- `POST /api/admin/addstudent` - Add student
- `DELETE /api/admin/removestudent/:id` - Remove student
- `GET /api/admin/inventory` - Get inventory

## 🛠️ Tech Stack

**Frontend:**
- React 19
- React Router v7
- Axios
- Tailwind CSS + DaisyUI

**Backend:**
- Node.js + Express
- Oracle Database (oracledb)
- dotenv
- CORS

## 👥 Contributors

- Rameezhoda21

## 📄 License

This project is for educational purposes.
