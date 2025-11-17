# Library Management System - Database Setup

This directory contains all SQL scripts for setting up the Oracle database for the library management system.

## 📁 Database Files (10 Files Total - Minimal & Clean!)

### ⭐ Core Setup Files (Run These In Order!)
1. **`00_sequences.sql`** - Creates auto-increment sequences for IDs
2. **`01_create_tables.sql`** - Creates all database tables (STUDENTS, BOOKS, BORROW, etc.)
3. **`02_views_oracle.sql`** - Creates database views for reporting
4. **`03_triggers.sql`** - Creates triggers for approval workflow, fines, and availability
5. **`04_login_credentials.sql`** - Inserts login credentials only (admins, librarians, students)

### 🧹 Utility Files
- **`00_drop_all.sql`** - Drops all existing tables, views, triggers, and sequences (clean slate)
- **`06_cleanup.sql`** - Drops all user objects completely

### 📝 Note:
All operational data (books, borrows, fines, reservations) should be added through the website, not SQL files.

### 🤖 Automation
- **`setup-database.ps1`** - PowerShell script to run all files automatically
- **`README.md`** - This file

---

## 🚀 Quick Setup Guide

### Prerequisites
- ✅ Oracle Database installed and running
- ✅ SQL Developer installed (or SQL*Plus)
- ✅ Oracle user created with necessary privileges

---

## Option 1: Automated Setup (PowerShell) ⚡ RECOMMENDED

Run the automated setup script from the `database` folder:

```powershell
cd database
.\setup-database.ps1
```

Or with custom credentials:

```powershell
.\setup-database.ps1 -User "hasan" -Password "123" -ConnectString "localhost:1521/ORCL"
```

The script will automatically run all 5 setup files in order.

---

## Option 2: Manual Setup (SQL Developer)

**Step-by-Step:**
1. Open SQL Developer and connect to your Oracle database
2. Open SQL Worksheet (Tools → SQL Worksheet or `Ctrl+Shift+N`)
3. Execute files in **EXACT ORDER** using **F5 (Run Script)**:
   - ① `00_sequences.sql` (creates auto-increment sequences)
   - ② `01_create_tables.sql` (creates 7 tables)
   - ③ `02_views_oracle.sql` (creates views for reports)
   - ④ `03_triggers.sql` (creates 5 triggers for business logic)
   - ⑤ `04_login_credentials.sql` (inserts login credentials for admins, librarians, students)

**Important:** Run `00_drop_all.sql` first if you're re-setting up the database.

---

---

## 🔌 Connecting Backend to Database

### Step 1: Configure Environment Variables

Edit `backend/.env` with your Oracle connection details:

```env
DB_USER=hasan
DB_PASSWORD=123
DB_CONNECT_STRING=localhost:1521/ORCL
```

**Connect String Examples:**
- Oracle XE: `localhost:1521/XEPDB1`
- Oracle Standard: `localhost:1521/ORCL`
- Remote: `hostname:1521/service_name`

### Step 2: Install Oracle Instant Client (Windows)

1. Download from: https://www.oracle.com/database/technologies/instant-client/downloads.html
2. Extract to: `C:\oracle\instantclient_19_12` (or any folder)
3. Add to PATH or set in `.env`:
   ```env
   INSTANT_CLIENT_DIR=C:\oracle\instantclient_19_12
   ```

### Step 3: Install Dependencies and Start Servers

```powershell
# Backend
cd backend
npm install
npm run dev

# Frontend (in new terminal)
cd frontend
npm install
npm start
```

### Step 4: Test Database Connection

Backend: http://localhost:5000/api/testdb
Frontend: http://localhost:3000

Expected response:
```json
{"MESSAGE": "Connected to Oracle!"}
```

---

---

## 🧪 Testing the System

After setup, test the approval workflow:

1. **Login as Student** (ERP: `22001`, Password: `pass123`)
2. **Browse Books** and click "Borrow" on any available book
3. **Check "My Books"** - should show status as "Pending Approval"
4. **Login as Librarian** (ID: `101`, Password: `lib123`)
5. **Go to "Issue Requests"** - should see pending request
6. **Click "Issue Book"** - approves the request
7. **Login as Student again** - "My Books" should now show "Issued" with dates

### API Endpoints to Test:
- **Test Connection:** `GET http://localhost:5000/api/testdb`
- **Pending Requests:** `GET http://localhost:5000/api/librarian/requests/pending`
- **Student Borrows:** `GET http://localhost:5000/api/student/borrowed/:erp_id`

---

---

## 🗂️ Database Schema Overview

### Tables Created:
- **STUDENTS** - Student information, fine tracking, approval workflow support
- **BOOKS** - Book catalog with availability tracking
- **BORROW** - Borrowing records with approval workflow (PENDING/ISSUED/RETURNED status)
- **ADMINS** - Administrator accounts
- **LIBRARY_POLICY** - Loan periods and fine rates
- **RESERVATIONS** - Book reservation queue
- **LIBRARIAN** - Librarian accounts

### Views Created:
- Student borrowing history with book details
- Available books list
- Overdue books with fine calculations
- Borrowing statistics

### Triggers (5 Total):
1. **`trg_borrow_before_insert`** - Validates fines and book availability for PENDING requests
2. **`trg_borrow_before_update`** - Sets issue_date and due_date when librarian approves (PENDING → ISSUED)
3. **`trg_borrow_after_approval`** - Reduces available_copies after approval
4. **`trg_borrow_before_return`** - Sets status to RETURNED and return_date
5. **`trg_borrow_after_return`** - Calculates fines, updates student fine_due, increases available_copies

### Approval Workflow:
- Student creates borrow request → Status: **PENDING**
- Librarian sees request in "Issue Requests" page
- Librarian approves at counter → Status: **ISSUED**, sets issue_date, approval_date, due_date
- Student returns book → Status: **RETURNED**, fine calculated if overdue

---

## 🐛 Troubleshooting

### Error: "ORA-12154: TNS:could not resolve the connect identifier"
- Check `DB_CONNECT_STRING` format in `.env`
- Verify Oracle service is running: `lsnrctl status`

### Error: "DPI-1047: Cannot locate a 64-bit Oracle Client library"
- Install Oracle Instant Client
- Set `INSTANT_CLIENT_DIR` in `.env`
- Ensure the path contains `oci.dll`

### Error: "ORA-01017: invalid username/password"
- Verify credentials in `.env`
- Test connection in SQL Developer first

### Error: "ORA-00942: table or view does not exist"
- Run `01_create_tables.sql` first
- Check if you're connected to the correct schema

### Backend won't start
- Check if port 5000 is available
- Look for errors in terminal output
- Verify all dependencies installed: `npm install`

---

## 📋 Verification Checklist

After setup, verify:

- [ ] All 5 SQL files executed without errors
- [ ] Tables exist: `SELECT table_name FROM user_tables;`
- [ ] Sample data inserted: `SELECT COUNT(*) FROM STUDENTS;`
- [ ] Backend starts: `npm run dev`
- [ ] Test endpoint works: `http://localhost:5000/api/testdb`
- [ ] No connection errors in console

---

---

## 🔄 Rebuilding Database

To start fresh:

### Using PowerShell Script:
```powershell
cd database
.\setup-database.ps1
```

### Using SQL Developer:
```sql
-- Run each file with F5 (Run Script) in order:
@00_drop_all.sql
@00_sequences.sql
@01_create_tables.sql
@02_views_oracle.sql
@03_triggers.sql
@04_login_credentials.sql
```

---

---

## 🔐 Default Login Credentials

**Admin:**
- Username: `admin`
- Password: `admin123`

**Librarians:**
- ID: `101`, Password: `lib123`
- ID: `102`, Password: `lib123`
- ID: `103`, Password: `lib123`

**Students:**
- ERP: `22001`, Password: `pass123`
- ERP: `22002`, Password: `pass123`
- ERP: `22003`, Password: `pass123`
- ERP: `22004`, Password: `pass123`
- ERP: `22005`, Password: `pass123`

---

## 📋 Verification Checklist

After setup, verify:

- [ ] All 5 SQL files executed without errors
- [ ] Tables exist: `SELECT table_name FROM user_tables;`
- [ ] Sequences exist: `SELECT sequence_name FROM user_sequences;`
- [ ] Sample data inserted: `SELECT COUNT(*) FROM STUDENTS;` (should be 5)
- [ ] Backend starts: `npm run dev` (port 5000)
- [ ] Frontend starts: `npm start` (port 3000)
- [ ] Test endpoint works: http://localhost:5000/api/testdb
- [ ] Login works for all user types
- [ ] Approval workflow: Student borrow → Librarian approve → Student sees issued

---

## ⚠️ Important Notes

- **Change default passwords in production!**
- **Sequences must be created BEFORE tables** (run `00_sequences.sql` first)
- **Triggers handle approval workflow automatically** - no manual date setting needed
- **Students cannot borrow if they have unpaid fines**
- **Books are not immediately issued** - librarians must approve at counter
- **Fines are calculated automatically on return** if book is overdue
