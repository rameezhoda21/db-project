# Backend Database Connection & Login Flow Explanation

## Overview
This document explains how the Node.js backend connects to the Oracle database and handles user authentication in the Library Management System.

## 1. Database Connection Architecture

### Connection Configuration (`backend/config/db.js`)
The backend uses the `oracledb` npm package to connect to Oracle Database:

```javascript
// Connection pool configuration
const poolConfig = {
  user: process.env.DB_USER || "C##RAMEEZHODA",
  password: process.env.DB_PASSWORD || "123", 
  connectString: process.env.DB_CONNECT_STRING || "localhost:1521/orcl",
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 1,
};
```

**Key Components:**
- **Connection Pool**: Maintains 2-10 concurrent connections for performance
- **Oracle Client**: Initializes Oracle Instant Client for database communication
- **Environment Variables**: Database credentials stored in `.env` file
- **Auto-commit**: All queries automatically commit transactions

### Database Helper Function
```javascript
export async function query(sql, params = {}) {
  let connection;
  try {
    connection = await pool.getConnection();
    const result = await connection.execute(sql, params, {
      autoCommit: true,
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });
    return result;
  } finally {
    if (connection) await connection.close();
  }
}
```

## 2. Server Initialization (`backend/server.js`)

The server initializes in this order:
1. **Import Dependencies**: Express, CORS, database config, route handlers
2. **Initialize Database**: `await initDB()` creates the connection pool
3. **Setup Middleware**: CORS for frontend communication, JSON parsing
4. **Mount Routes**: Auth, books, librarian, student, admin endpoints
5. **Start Server**: Listen on port 5000

```javascript
import { initDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

await initDB(); // Database connection established

app.use("/api/auth", authRoutes);
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
```

## 3. Database Schema Overview

### Core Tables:
- **STUDENTS**: Student accounts (ERP ID, email @khi.iba.edu.pk, password)
- **LIBRARIAN**: Librarian accounts (ID, email @gmail.com, password)  
- **ADMINS**: Admin accounts (ID, email @gmail.com, password)
- **USERS**: New unified registration system for all roles
- **BOOKS**: Book catalog with availability tracking
- **BORROW**: Active book borrowings
- **RETURNS**: Book return history

### Authentication System:
The system has **TWO** authentication methods:

1. **New System (USERS table)**: For users who register through the signup form
2. **Legacy System**: Hardcoded accounts in STUDENTS/LIBRARIAN/ADMINS tables

## 4. Login Flow Detailed Breakdown

### Step 1: Frontend Login Request
```javascript
// From frontend/src/pages/login.jsx
const response = await api.post("/auth/login", {
  email: email,
  erpId: erpId, 
  password: password,
  role: role
});
```

### Step 2: Backend Route Handler (`backend/routes/auth.js`)

#### A. Input Validation
```javascript
const { email, erpId, password, role } = req.body;
console.log("🔍 Login attempt:", { email, erpId, role });
```

#### B. New Authentication System (USERS Table)
```sql
SELECT user_id, email, password_hash, first_name, last_name, role, status, erp_id, librarian_id
FROM USERS  
WHERE email = :email AND role = :role
```

**Process:**
1. Check if email exists in USERS table
2. Verify account status (pending/approved/rejected)
3. Compare password with bcrypt hash
4. Generate JWT token if successful

#### C. Legacy System Fallback
If not found in USERS table, check legacy tables:

**For Students:**
```sql
SELECT erp_id, first_name, last_name, email
FROM STUDENTS
WHERE erp_id = :erpId AND pass = :password
```

**For Librarians:**
```sql  
SELECT librarian_id, first_name, last_name, email
FROM LIBRARIAN
WHERE librarian_id = :librarianId AND pass = :password
```

**For Admins:**
```sql
SELECT admin_id, first_name, last_name, email  
FROM ADMINS
WHERE admin_id = :id AND pass = :pw
-- OR email = :email AND pass = :pw
```

### Step 3: JWT Token Generation
```javascript
import jwt from 'jsonwebtoken';

const token = generateToken({
  user_id: user.USER_ID,
  email: user.EMAIL,
  first_name: user.FIRST_NAME,
  last_name: user.LAST_NAME,
  role: user.ROLE,
  erp_id: user.ERP_ID
});

// JWT contains user info for authorization
```

### Step 4: Response to Frontend
```javascript
return res.json({
  message: "Login successful",
  token: token,
  user: {
    userId: user.USER_ID,
    email: user.EMAIL,
    firstName: user.FIRST_NAME,
    lastName: user.LAST_NAME,
    role: user.ROLE,
    erpId: user.ERP_ID
  }
});
```

### Step 5: Frontend Token Storage
```javascript
// From frontend/src/context/authContext.js
const login = (userData) => {
  const userToStore = userData.user || userData;
  setUser(userToStore);
  localStorage.setItem("user", JSON.stringify(userToStore));
};
```

## 5. Authorization Flow

### Protected Route Access
1. **Frontend**: Includes JWT token in API requests
```javascript
// From frontend/src/services/api.js
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

2. **Backend Middleware**: Validates token on protected routes
```javascript
// From backend/middleware/auth.js
export function authenticateToken(req, res, next) {
  const token = authHeader && authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
```

## 6. Database Query Examples

### Student Borrow Request:
```sql
INSERT INTO BORROW (student_id, book_id, borrow_date, due_date, status)
VALUES (:studentId, :bookId, SYSDATE, SYSDATE + 14, 'active')
```

### Check Fines:
```sql
SELECT s.fine_due, COUNT(b.borrow_id) as overdue_books
FROM STUDENTS s
LEFT JOIN BORROW b ON s.erp_id = b.student_id 
WHERE s.erp_id = :studentId AND b.due_date < SYSDATE AND b.status = 'active'
```

### Book Availability:
```sql
UPDATE BOOKS 
SET available_copies = available_copies - 1 
WHERE book_id = :bookId AND available_copies > 0
```

## 7. Error Handling

### Database Connection Errors:
```javascript
try {
  pool = await oracledb.createPool(poolConfig);
  console.log("✅ Oracle connection pool created");
} catch (err) {
  console.error("❌ Error creating Oracle connection pool:", err);
  process.exit(1);
}
```

### Query Errors:
```javascript
try {
  const result = await query(sql, params);
  return result;
} catch (err) {
  console.error("❌ Database query error:", err);
  res.status(500).json({ error: err.message });
}
```

## 8. Security Features

- **Password Hashing**: bcrypt for new user registrations
- **JWT Tokens**: Stateless authentication with expiration
- **Input Validation**: Email format and role-based validation
- **SQL Injection Prevention**: Parameterized queries
- **CORS**: Configured for frontend-backend communication
- **Environment Variables**: Sensitive data stored in .env

## 9. Connection Flow Summary

```
Frontend (React) → API Request → Express Server → Route Handler → 
Database Query → Oracle DB → Result → JSON Response → Frontend Update
```

**Port Configuration:**
- Backend API: `localhost:5000`
- Frontend: `localhost:3000`  
- Oracle DB: `localhost:1521/orcl`

This architecture ensures secure, scalable database operations with proper separation of concerns between frontend presentation, backend logic, and database persistence.