# 🚀 Quick Start - Oracle Database Connection

## What Was Done

Your Oracle database files from the `database-with-triggers` branch have been successfully integrated into this project! Here's what was set up:

### ✅ Files Added/Updated

1. **Database SQL Files** (in `database/` folder):
   - `00_drop_all.sql` - Drops existing objects
   - `01_create_tables.sql` - Creates all tables
   - `02_views_oracle.sql` - Creates views
   - `03_triggers_oracle.sql` - Creates triggers
   - `04_sample_data_oracle.sql` - Inserts test data

2. **Configuration Files**:
   - `backend/.env` - Your Oracle credentials (✨ NEW)
   - `backend/.env.example` - Template for credentials
   - `backend/config/db.js` - Updated with Instant Client support

3. **Helper Scripts**:
   - `database/setup-database.ps1` - Automated SQL execution
   - `database/MANUAL_SETUP.md` - Step-by-step SQL Developer guide

4. **Documentation**:
   - `database/README.md` - Complete database documentation
   - `ORACLE_SETUP_GUIDE.md` - Comprehensive setup instructions

---

## 🎯 Your Next Steps (5-10 minutes)

### Step 1: Setup Database in SQL Developer

Open SQL Developer and run these files **in order** using `F5`:

```
1. database/00_drop_all.sql
2. database/01_create_tables.sql
3. database/02_views_oracle.sql
4. database/03_triggers_oracle.sql
5. database/04_sample_data_oracle.sql
```

**Tip:** See `database/MANUAL_SETUP.md` for detailed instructions.

---

### Step 2: Configure Backend Credentials

Edit `backend/.env` and update these three lines:

```env
DB_USER=C##RAMEEZHODA              # Your Oracle username
DB_PASSWORD=123                     # Your Oracle password  
DB_CONNECT_STRING=localhost:1521/XEPDB1  # Your connection string
```

**How to find your connection string:**
- In SQL Developer, right-click your connection → Properties
- Look at the connection details
- Common formats: `localhost:1521/XEPDB1` or `localhost:1521/ORCL`

---

### Step 3: Install Oracle Instant Client (if needed)

**Check if you need this:**
```powershell
cd backend
npm run dev
```

If you see **"Cannot locate Oracle Client library"**, then:

1. Download from: https://www.oracle.com/database/technologies/instant-client/downloads.html
2. Extract to: `C:\oracle\instantclient_19_12`
3. Add to `backend/.env`:
   ```env
   INSTANT_CLIENT_DIR=C:\oracle\instantclient_19_12
   ```

**See `ORACLE_SETUP_GUIDE.md` Step 3 for detailed instructions.**

---

### Step 4: Install Dependencies & Start Backend

```powershell
cd backend
npm install
npm run dev
```

**Expected output:**
```
✅ Oracle Client initialized
✅ Oracle connection pool created
🚀 Server running on port 5000
```

---

### Step 5: Test Connection

Open browser or use PowerShell:

```powershell
curl http://localhost:5000/api/testdb
```

**Success response:**
```json
{"MESSAGE": "Connected to Oracle!"}
```

---

## 🎉 Done!

Your Oracle database is now connected to the backend!

**Test it further:**
```powershell
# View all students
curl http://localhost:5000/api/debug/students

# View all librarians
curl http://localhost:5000/api/debug/librarians
```

**Start the frontend:**
```powershell
cd frontend
npm install
npm start
```

Visit: http://localhost:3000

---

## 🐛 Having Issues?

**See detailed troubleshooting in:**
- `ORACLE_SETUP_GUIDE.md` - Complete setup guide
- `database/README.md` - Database-specific help

**Common issues:**
- ❌ Can't connect → Check credentials in `backend/.env`
- ❌ Missing Oracle Client → Install Instant Client (Step 3 above)
- ❌ Tables don't exist → Run SQL scripts in SQL Developer (Step 1)

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `ORACLE_SETUP_GUIDE.md` | **START HERE** - Complete setup walkthrough |
| `database/README.md` | Database schema & setup details |
| `database/MANUAL_SETUP.md` | SQL Developer step-by-step |
| `backend/.env.example` | Template for credentials |

---

**Need help?** Check `ORACLE_SETUP_GUIDE.md` for detailed solutions to common problems!
