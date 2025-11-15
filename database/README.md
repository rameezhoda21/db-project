# Library Management System - Database Setup

This directory contains all SQL scripts for setting up the Oracle database for the library management system.

## 📁 Database Files

### ⭐ Core Files (Use These!)
- **`00_drop_all.sql`** - Drops all existing tables, views, and triggers (clean slate)
- **`01_create_tables.sql`** - Creates all database tables (STUDENTS, BOOKS, BORROW, ADMINS, etc.)
- **`02_views_oracle.sql`** - Creates database views for reporting
- **`03_triggers_oracle.sql`** - Creates triggers for business logic
- **`04_sample_data_oracle.sql`** - Inserts sample data for testing

### Legacy Files (For Reference)
- `schema.sql`, `seed-data.sql`, `views.sql`, `triggers.sql` - Older versions

---

## 🚀 Quick Setup Guide

### Prerequisites
- ✅ Oracle Database installed and running
- ✅ SQL Developer installed
- ✅ Oracle user created (e.g., `C##RAMEEZHODA` with password `123`)

---

## Option 1: Automated Setup (PowerShell)

Run the automated setup script:

```powershell
cd database
.\setup-database.ps1
```

Or with custom credentials:

```powershell
.\setup-database.ps1 -User "YOUR_USER" -Password "YOUR_PASSWORD" -ConnectString "localhost:1521/XEPDB1"
```

---

## Option 2: Manual Setup (SQL Developer)

See **`MANUAL_SETUP.md`** for detailed step-by-step instructions using SQL Developer.

**Quick Steps:**
1. Open SQL Developer and connect to your Oracle database
2. Open SQL Worksheet (Tools → SQL Worksheet or Ctrl+Shift+N)
3. Execute files in order using **F5 (Run Script)**:
   - `00_drop_all.sql`
   - `01_create_tables.sql`
   - `02_views_oracle.sql`
   - `03_triggers_oracle.sql`
   - `04_sample_data_oracle.sql`

---

## 🔌 Connecting Backend to Database

### Step 1: Configure Environment Variables

Edit `backend/.env` with your Oracle connection details:

```env
DB_USER=C##RAMEEZHODA
DB_PASSWORD=123
DB_CONNECT_STRING=localhost:1521/XEPDB1
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

### Step 3: Install Node Dependencies

```powershell
cd backend
npm install
```

### Step 4: Start Backend Server

```powershell
npm run dev
```

### Step 5: Test Database Connection

Open browser or use `curl`:

```powershell
curl http://localhost:5000/api/testdb
```

Expected response:
```json
{"MESSAGE": "Connected to Oracle!"}
```

---

## 🧪 Testing Endpoints

After setup, test these endpoints:

- **Test Connection:** `GET http://localhost:5000/api/testdb`
- **View Students:** `GET http://localhost:5000/api/debug/students`
- **View Librarians:** `GET http://localhost:5000/api/debug/librarians`

---

## 🗂️ Database Schema Overview

### Tables Created:
- **STUDENTS** - Student information and fine tracking
- **BOOKS** - Book catalog with availability
- **BORROW** - Borrowing records (issue/return dates)
- **ADMINS** - Administrator accounts
- **LIBRARY_POLICY** - Loan periods and fine rates
- **RESERVATIONS** - Book reservation queue
- **LIBRARIAN** - Librarian accounts

### Views Created:
- Student borrowing history
- Available books
- Overdue books
- Fine calculations

### Triggers:
- Auto-update available copies on borrow/return
- Calculate due dates based on policy
- Calculate fines for overdue books

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

## 🔄 Rebuilding Database

To start fresh:

```sql
-- In SQL Developer, run:
@00_drop_all.sql
@01_create_tables.sql
@02_views_oracle.sql
@03_triggers_oracle.sql
@04_sample_data_oracle.sql
```

Or use the PowerShell script again:
```powershell
.\setup-database.ps1
```

---

## 🔐 Default Login Credentials

**Admin:**
- Username: `admin`
- Password: `admin123`

**Librarians:**
- ID: `1`, Password: `lib123`
- ID: `2`, Password: `lib123`
- ID: `3`, Password: `lib123`

**Students:**
- ERP: `S1001`, Password: `pass123`
- ERP: `S1002`, Password: `pass123`
- ERP: `S1003`, Password: `pass123`
- ERP: `S1004`, Password: `pass123`
- ERP: `S1005`, Password: `pass123`

## ⚠️ Notes

- Change default passwords in production
- Adjust fine calculation in triggers as needed
- Modify borrow limits in triggers if required
