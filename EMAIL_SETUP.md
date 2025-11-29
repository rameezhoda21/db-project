# Email Configuration Guide

This guide explains how to set up email functionality for the password reset feature.

## Gmail Setup (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security**
3. Enable **2-Step Verification**

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select **Mail** as the app
3. Select **Other** as the device and enter "IBA Library"
4. Click **Generate**
5. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)

### Step 3: Update .env File
Open `backend/.env` and update these values:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # Your App Password from Step 2
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=IBA Library System
```

## Other Email Providers

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=your-email@outlook.com
```

### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password  # Generate from Yahoo Account Security
EMAIL_FROM=your-email@yahoo.com
```

## Testing

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Go to http://localhost:3000/forgot-password
3. Select your role (Student/Librarian/Admin)
4. Enter your registered email
5. Click "Send Reset Link"
6. Check your email inbox

## Features

### Forgot Password
- All users (students, librarians, admins) can reset their password
- Reset link is valid for 1 hour
- Secure token-based system

### Remember Me
- Login page has "Remember Me" checkbox
- Saves email and role for next visit
- Improves user experience

### Email Templates
- Professional HTML email design
- IBA Library branding
- Clear call-to-action buttons
- Mobile responsive

## Troubleshooting

### Emails not sending?
1. Check that all EMAIL_* variables are set in .env
2. Verify App Password is correct (no spaces)
3. Check backend console for error messages
4. Ensure your email provider allows SMTP access

### Reset link not working?
1. Link expires after 1 hour
2. Link can only be used once
3. Request a new reset link if expired

### "Invalid or expired token" error?
- Token has expired (1 hour limit)
- Token was already used
- Request a new password reset

## Security Notes

- Never commit .env file with real credentials
- Use App Passwords instead of account passwords
- Reset tokens expire after 1 hour
- Tokens are single-use only
- Passwords are hashed with bcrypt (registered users)
