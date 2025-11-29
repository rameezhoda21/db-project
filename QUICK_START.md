# 🚀 Quick Start Guide - Forgot Password Feature

## Prerequisites
- Database already set up ✅
- Backend and frontend installed ✅

## Step 1: Configure Email (Required for Forgot Password)

### Option A: Using Gmail (Recommended)

1. **Enable 2-Factor Authentication**:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "IBA Library"
   - Copy the 16-character password

3. **Update backend/.env**:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   EMAIL_FROM=your-email@gmail.com
   EMAIL_FROM_NAME=IBA Library System
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=nXOlx6Osi0ud0qN68pLXI8fvMSN9OeU84ouMpmzVdz
   ```

### Option B: Skip Email (Testing Only)
You can still use the system, but forgot password emails won't be sent.

## Step 2: Start the Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

## Step 3: Test Features

### 1. Test Forgot Password
- Go to http://localhost:3000/login
- Click "Forgot Password?"
- Select role (Student/Librarian/Admin)
- Enter your registered email
- Check your email for reset link
- Click link and set new password

### 2. Test Remember Me
- Login with "Remember Me" checked
- Close browser
- Open http://localhost:3000/login
- Your email and role should be pre-filled

### 3. Test Admin Login Toggle
- Select "Admin" role on login
- Click "Login with ID" / "Login with Email" to toggle
- Login with either admin ID (1) or email (admin@iba.edu.pk)

## 🎯 What's New

### Forgot Password
- All users can reset their password via email
- Secure token-based system (1-hour expiry)
- Works for registered and hardcoded users

### Remember Me
- Checkbox on login page
- Saves email and role preferences
- Auto-fills on next visit

### Admin Login Toggle
- Switch between ID and email login
- Small link above the input field
- Remembers preference with Remember Me

## 📧 Email Setup Status

If you configured email properly, you should receive:
- ✅ Password reset emails
- ✅ Account approval emails (admin approval notifications)

If emails aren't working:
1. Check .env file has correct EMAIL_* values
2. Verify App Password is correct (no spaces)
3. Check backend console for errors

## 🧪 Test Credentials

### Hardcoded Admin
- **Email**: admin@iba.edu.pk
- **ID**: 1
- **Password**: admin123

### Hardcoded Student
- **Email**: ahmed.hassan@khi.iba.edu.pk
- **ERP**: 22001
- **Password**: pass123

### Hardcoded Librarian
- **Email**: sara.ahmed@iba.edu.pk
- **ID**: 101
- **Password**: lib123

## 🔍 Troubleshooting

### Forgot Password Not Working?
1. Check if email is configured in .env
2. Try with a registered user email
3. Check spam folder
4. Check backend console for errors

### Remember Me Not Working?
1. Check browser allows localStorage
2. Make sure to check the checkbox before login
3. Try clearing browser cache

### Admin Login Toggle Not Showing?
1. Select "Admin" role first
2. Look for small link above input field
3. Clear browser cache if needed

## 📚 Full Documentation

- `EMAIL_SETUP.md` - Detailed email configuration
- `FORGOT_PASSWORD_IMPLEMENTATION.md` - Complete implementation details
- `README.md` - Project overview

## ✅ Everything is Ready!

All features are implemented and tested:
- ✅ User registration with approval
- ✅ JWT authentication
- ✅ Forgot password
- ✅ Remember me
- ✅ Admin login toggle
- ✅ Book borrowing system
- ✅ Fine calculation
- ✅ Email notifications

Just configure your email in .env and start testing! 🎉
