# 🎯 Oracle Database Connection Setup - Complete Guide

This guide walks you through connecting your Oracle database (created in SQL Developer) to this Node.js backend application.

## ✅ Prerequisites Check

Before starting, ensure you have:
- [x] Oracle Database installed and running
- [x] SQL Developer installed
- [x] Oracle user created (e.g., `C##RAMEEZHODA`)
- [x] Node.js installed (v16 or higher)
- [x] This project cloned/downloaded

---

## 📋 Step-by-Step Setup

### Step 1: Setup Database Schema

You have **two options** to set up your database:

#### **Option A: Use SQL Developer (Recommended for beginners)**

1. Open **SQL Developer**
2. Connect to your Oracle database using your credentials
3. Open SQL Worksheet (File → Open SQL Worksheet or `Ctrl+Shift+N`)
4. Execute the SQL files **in this exact order** using `F5` (Run Script):

   ```
   1. database/00_drop_all.sql       (Cleans existing objects)
   2. database/01_create_tables.sql  (Creates tables)
   3. database/02_views_oracle.sql   (Creates views)
   4. database/03_triggers_oracle.sql (Creates triggers)
   5. database/04_sample_data_oracle.sql (Inserts test data)
   ```

5. Check for errors in the Script Output tab
6. Verify tables were created:
   ```sql
   SELECT table_name FROM user_tables;
   ```

See `database/MANUAL_SETUP.md` for detailed instructions with screenshots.

#### **Option B: Use PowerShell Script (Advanced)**

```powershell
cd database
.\setup-database.ps1 -User "C##RAMEEZHODA" -Password "123" -ConnectString "localhost:1521/XEPDB1"
```

---

### Step 2: Configure Backend Connection

1. **Navigate to backend folder:**
   ```powershell
   cd backend
   ```

2. **Edit `.env` file** (already created for you):
   Open `backend/.env` and update these values:

   ```env
   DB_USER=C##RAMEEZHODA              # Your Oracle username
   DB_PASSWORD=123                     # Your Oracle password
   DB_CONNECT_STRING=localhost:1521/XEPDB1  # Your connection string
   ```

   **Common Connection Strings:**
   - Oracle XE (Express Edition): `localhost:1521/XEPDB1`
   - Oracle Standard: `localhost:1521/ORCL`
   - Oracle with PDB: `localhost:1521/ORCLPDB1`
   - Remote server: `hostname:1521/service_name`

3. **Test your connection in SQL Developer first** to verify these credentials work!

---

### Step 3: Install Oracle Instant Client

The Node.js `oracledb` driver needs Oracle Client libraries.

#### **Windows Installation:**

1. **Download Oracle Instant Client:**
   - Go to: https://www.oracle.com/database/technologies/instant-client/downloads.html
   - Download **Basic Package** for Windows x64
   - Example: `instantclient-basic-windows.x64-19.12.0.0.0dbru.zip`

2. **Extract the ZIP file:**
   ```powershell
   # Extract to a permanent location like:
   C:\oracle\instantclient_19_12
   ```

3. **Add to PATH (choose one method):**

   **Method A: Temporary (current PowerShell session only)**
   ```powershell
   $env:PATH = 'C:\oracle\instantclient_19_12;' + $env:PATH
   ```

   **Method B: Persistent (recommended)**
   - Right-click **This PC** → Properties → Advanced System Settings
   - Click **Environment Variables**
   - Under **System Variables**, find `Path` → Edit
   - Add new entry: `C:\oracle\instantclient_19_12`
   - Click OK and restart terminal

   **Method C: Use .env file**
   - Add to `backend/.env`:
     ```env
     INSTANT_CLIENT_DIR=C:\oracle\instantclient_19_12
     ```

4. **Verify installation:**
   ```powershell
   # Check if oci.dll exists
   Test-Path C:\oracle\instantclient_19_12\oci.dll
   # Should return: True
   ```

---

### Step 4: Install Node.js Dependencies

```powershell
cd backend
npm install
```

This installs:
- `express` - Web framework
- `oracledb` - Oracle database driver
- `dotenv` - Environment variables
- `cors` - Cross-origin requests
- `nodemon` - Auto-restart during development

---

### Step 5: Start the Backend Server

```powershell
npm run dev
```

**Expected output:**
```
✅ Oracle Client initialized with libDir: C:\oracle\instantclient_19_12
✅ Oracle connection pool created
🚀 Server running on port 5000
```

**If you see errors**, check the Troubleshooting section below.

---

### Step 6: Test Database Connection

Open a browser or use PowerShell:

```powershell
# Test basic connection
curl http://localhost:5000/api/testdb

# View students table
curl http://localhost:5000/api/debug/students

# View librarians table
curl http://localhost:5000/api/debug/librarians
```

**Expected Response (testdb):**
```json
{"MESSAGE": "Connected to Oracle!"}
```

---

## 🎉 Success! Your Database is Connected!

You can now:
- Start the frontend: `cd frontend && npm start`
- Access the application at `http://localhost:3000`
- Login with test accounts (see database/README.md)

---

## 🐛 Common Issues & Solutions

### ❌ Error: "DPI-1047: Cannot locate a 64-bit Oracle Client library"

**Solution:**
- Install Oracle Instant Client (Step 3 above)
- Verify path in `.env`: `INSTANT_CLIENT_DIR=C:\oracle\instantclient_19_12`
- Ensure `oci.dll` exists in that folder
- Restart terminal after setting PATH

### ❌ Error: "ORA-12154: TNS:could not resolve the connect identifier"

**Solution:**
- Check `DB_CONNECT_STRING` format in `.env`
- Try different formats:
  - `localhost:1521/XEPDB1`
  - `localhost/XEPDB1`
  - `//localhost:1521/XEPDB1`
- Verify Oracle listener is running:
  ```powershell
  lsnrctl status
  ```

### ❌ Error: "ORA-01017: invalid username/password"

**Solution:**
- Verify credentials in `.env` match SQL Developer
- Test connection in SQL Developer first
- Check if password has special characters (escape if needed)

### ❌ Error: "ORA-00942: table or view does not exist"

**Solution:**
- Run database setup scripts (Step 1)
- Verify tables exist in SQL Developer:
  ```sql
  SELECT table_name FROM user_tables;
  ```
- Check you're connected to correct schema

### ❌ Error: "EADDRINUSE: address already in use :::5000"

**Solution:**
- Port 5000 is already in use
- Kill the process or change port in `.env`:
  ```env
  PORT=5001
  ```

### ❌ Backend starts but connection fails silently

**Solution:**
- Check Oracle service is running:
  - Open **Services** (Win+R → `services.msc`)
  - Look for `OracleServiceXE` or similar
  - Ensure status is "Running"
- Check firewall isn't blocking port 1521

---

## 📁 Project Structure

```
db-project/
├── backend/
│   ├── .env              ← Your Oracle credentials (DO NOT COMMIT)
│   ├── .env.example      ← Template file
│   ├── config/
│   │   └── db.js         ← Oracle connection logic
│   ├── server.js         ← Express server
│   └── package.json
├── database/
│   ├── 00_drop_all.sql   ← Clean database
│   ├── 01_create_tables.sql ← Create tables
│   ├── 02_views_oracle.sql  ← Create views
│   ├── 03_triggers_oracle.sql ← Create triggers
│   ├── 04_sample_data_oracle.sql ← Insert test data
│   ├── setup-database.ps1 ← Automated setup script
│   ├── MANUAL_SETUP.md    ← Detailed SQL Developer guide
│   └── README.md          ← Database documentation
└── frontend/
    └── ... (React app)
```

---

## 🔒 Security Notes

- **Never commit `.env` file** - it contains passwords
- `.env.example` is safe to commit (contains no real credentials)
- Change default passwords before deploying to production
- Use environment-specific `.env` files for dev/staging/prod

---

## 🔄 Rebuilding Database

If you need to start fresh:

**Option 1: SQL Developer**
```sql
@database/00_drop_all.sql
@database/01_create_tables.sql
@database/02_views_oracle.sql
@database/03_triggers_oracle.sql
@database/04_sample_data_oracle.sql
```

**Option 2: PowerShell**
```powershell
cd database
.\setup-database.ps1
```

---

## 📞 Need More Help?

- Check `database/README.md` for database-specific details
- Check `database/MANUAL_SETUP.md` for SQL Developer walkthrough
- Review `backend/config/db.js` for connection code
- Consult Oracle documentation: https://node-oracledb.readthedocs.io/

---

## ✅ Setup Verification Checklist

- [ ] Oracle Database running
- [ ] SQL scripts executed successfully
- [ ] Tables exist in database
- [ ] Sample data inserted
- [ ] Oracle Instant Client installed
- [ ] `backend/.env` configured correctly
- [ ] `npm install` completed without errors
- [ ] Backend server starts without errors
- [ ] Test endpoint returns success: `http://localhost:5000/api/testdb`
- [ ] No connection errors in console

Once all items are checked, your database is fully connected! 🎉
