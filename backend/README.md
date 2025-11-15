# Backend - Library Management System

Express.js REST API with Oracle Database integration.

## 📦 Installation

```bash
npm install
```

## ⚙️ Configuration

Create a `.env` file in this directory:

```env
DB_USER=your_oracle_username
DB_PASSWORD=your_password
DB_CONNECT_STRING=localhost:1521/orcl
```

## 🚀 Running

```bash
npm run dev    # Development with nodemon
npm start      # Production
```

Server runs on `http://localhost:5000`

## 📂 Structure

```
backend/
├── config/           # Database configuration
├── controllers/      # Business logic
├── routes/          # API endpoints
├── server.js        # Entry point
└── package.json
```

## 🔌 API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/student/*` - Student operations
- `/api/librarian/*` - Librarian operations
- `/api/admin/*` - Admin operations
- `/api/books/*` - Book queries

## 🗃️ Database

Uses Oracle Database with connection pooling:
- Pool size: 2-10 connections
- Auto-commit enabled
- Object format output

## 🔐 Security Notes

- Never commit `.env` file
- Use environment variables in production
- Implement JWT tokens for production use
- Add input validation middleware
