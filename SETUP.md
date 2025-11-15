# 🚀 Quick Setup Guide

Follow these steps to get your Library Management System up and running.

## Prerequisites

✅ Node.js (v16 or higher)  
✅ Oracle Database (19c or later)  
✅ npm or yarn package manager

## Step-by-Step Setup

### 1️⃣ Database Setup

```bash
# Connect to Oracle
sqlplus your_username/your_password@localhost:1521/orcl

# Run SQL scripts in order
@database/schema.sql
@database/views.sql
@database/triggers.sql
@database/seed-data.sql  # Optional: sample data
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (or use existing one)
# Add these values:
DB_USER=C##RAMEEZHODA
DB_PASSWORD=123
DB_CONNECT_STRING=localhost:1521/orcl

# Start backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

### 3️⃣ Frontend Setup

Open a **new terminal** and run:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

Frontend will run on: `http://localhost:3000`

## 🎉 You're Done!

Visit `http://localhost:3000` and login with:

**Student:**
- ERP ID: `S1001`
- Password: `pass123`

**Librarian:**
- ID: `1`
- Password: `lib123`

**Admin:**
- Username: `admin`
- Password: `admin123`

## 🐛 Troubleshooting

### Backend won't start?
- Check Oracle DB is running
- Verify `.env` file has correct credentials
- Ensure Oracle Instant Client is installed

### Frontend won't connect?
- Verify backend is running on port 5000
- Check CORS is enabled in backend
- Clear browser cache

### Database errors?
- Run scripts in correct order (schema → views → triggers)
- Check user has proper permissions
- Verify connection string is correct

## 📚 Next Steps

- Read `/backend/README.md` for API documentation
- Read `/frontend/README.md` for React app details
- Read `/database/README.md` for database schema
- Customize the UI in frontend
- Add more features to backend

Need help? Check the main README.md file!
