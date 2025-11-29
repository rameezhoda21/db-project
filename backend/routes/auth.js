import { query } from "../config/db.js";
import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "../middleware/auth.js";
import { sendPasswordResetEmail } from "../services/emailService.js";

const router = express.Router();

// ===== SIGNUP ENDPOINT =====
router.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName, role, erpId } = req.body;
  console.log("📝 Signup attempt:", { email, role, erpId });

  try {
    // Validate input
    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate ERP ID for students
    if (role === "student" && !erpId) {
      return res.status(400).json({ error: "ERP ID is required for students" });
    }

    if (!["student", "librarian", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Email validation by role
    if (role === "student" && !email.endsWith("@khi.iba.edu.pk")) {
      return res.status(400).json({ error: "Student email must be an IBA email (@khi.iba.edu.pk)" });
    }

    if ((role === "librarian" || role === "admin") && !email.endsWith("@gmail.com")) {
      return res.status(400).json({ error: `${role.charAt(0).toUpperCase() + role.slice(1)} email must be a Gmail address` });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    // Check if email already exists in USERS table
    const existingUser = await query(
      `SELECT email FROM USERS WHERE email = :email`,
      { email }
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // For students, check if ERP ID already exists
    if (role === "student" && erpId) {
      const existingErp = await query(
        `SELECT erp_id FROM USERS WHERE erp_id = :erpId`,
        { erpId }
      );
      if (existingErp.rows.length > 0) {
        return res.status(400).json({ error: "ERP ID already registered" });
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert into USERS table with ERP ID for students
    if (role === "student") {
      await query(
        `INSERT INTO USERS (email, password_hash, first_name, last_name, role, status, erp_id)
         VALUES (:email, :passwordHash, :firstName, :lastName, :role, 'pending', :erpId)`,
        { email, passwordHash, firstName, lastName, role, erpId }
      );
    } else {
      await query(
        `INSERT INTO USERS (email, password_hash, first_name, last_name, role, status)
         VALUES (:email, :passwordHash, :firstName, :lastName, :role, 'pending')`,
        { email, passwordHash, firstName, lastName, role }
      );
    }

    console.log("✅ User registered successfully:", email, role === "student" ? `ERP: ${erpId}` : "");
    res.status(201).json({
      message: "Registration successful! Please wait for admin approval.",
      email,
      role,
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    if (err.message.includes("ORA-20001") || err.message.includes("ORA-20002") || err.message.includes("ORA-20003")) {
      return res.status(400).json({ error: "Invalid email format for the selected role" });
    }
    res.status(500).json({ error: err.message });
  }
});

// ===== UNIFIED LOGIN ENDPOINT =====
router.post("/login", async (req, res) => {
  const { email, erpId, password, role } = req.body;
  console.log("🔍 Login attempt:", { email, erpId, role });

  try {
    // NEW AUTH SYSTEM - Check USERS table first (for registered users including admins)
    const loginEmail = email || erpId; // Admin can send email in erpId field
    if (loginEmail && loginEmail.includes('@')) {
      const userResult = await query(
        `SELECT user_id, email, password_hash, first_name, last_name, role, status, erp_id, librarian_id
         FROM USERS
         WHERE email = :email AND role = :role`,
        { email: loginEmail, role }
      );

      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];

        // Check if account is approved
        if (user.STATUS !== "approved") {
          if (user.STATUS === "pending") {
            return res.status(403).json({ error: "Your account is pending admin approval" });
          } else if (user.STATUS === "rejected") {
            return res.status(403).json({ error: "Your account registration was rejected" });
          }
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.PASSWORD_HASH);
        if (!passwordMatch) {
          return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT token
        const token = generateToken({
          user_id: user.USER_ID,
          email: user.EMAIL,
          first_name: user.FIRST_NAME,
          last_name: user.LAST_NAME,
          role: user.ROLE,
          erp_id: user.ERP_ID,
          librarian_id: user.LIBRARIAN_ID,
        });

        console.log("✅ User login successful:", user.EMAIL);
        return res.json({
          message: "Login successful",
          token,
          user: {
            userId: user.USER_ID,
            email: user.EMAIL,
            firstName: user.FIRST_NAME,
            lastName: user.LAST_NAME,
            role: user.ROLE,
            erpId: user.ERP_ID,
            librarianId: user.LIBRARIAN_ID,
          },
        });
      }
    }

    // HARDCODED ADMIN FALLBACK - For the default admin@iba.edu.pk account
    if (role === "admin") {
      const adminId = erpId || email; // Support both ID and email
      
      // Check if adminId is numeric (ID) or string (email)
      const isNumeric = /^\d+$/.test(adminId);
      
      let result;
      if (isNumeric) {
        // Login with admin ID
        result = await query(
          `SELECT admin_id, first_name, last_name, email
           FROM ADMINS
           WHERE admin_id = :id AND pass = :pw`,
          { id: adminId, pw: password }
        );
      } else {
        // Login with email
        result = await query(
          `SELECT admin_id, first_name, last_name, email
           FROM ADMINS
           WHERE email = :email AND pass = :pw`,
          { email: adminId, pw: password }
        );
      }

      if (result.rows.length > 0) {
        const admin = result.rows[0];
        const token = generateToken({
          admin_id: admin.ADMIN_ID,
          email: admin.EMAIL,
          first_name: admin.FIRST_NAME,
          last_name: admin.LAST_NAME,
          role: "admin",
        });

        console.log("✅ Hardcoded admin login successful:", admin.EMAIL);
        return res.json({
          message: "Login successful",
          token,
          user: {
            adminId: admin.ADMIN_ID,
            firstName: admin.FIRST_NAME,
            lastName: admin.LAST_NAME,
            email: admin.EMAIL,
            role: "admin",
          },
        });
      }
    }

    // FALLBACK - OLD HARDCODED SYSTEM (for existing students/librarians)
    if (role === "student" && erpId) {
      const result = await query(
        `SELECT erp_id, first_name, last_name, email
         FROM STUDENTS
         WHERE erp_id = :erp AND pass = :pw`,
        { erp: erpId, pw: password }
      );

      if (result.rows.length > 0) {
        const student = result.rows[0];
        const token = generateToken({
          erp_id: student.ERP_ID,
          email: student.EMAIL,
          first_name: student.FIRST_NAME,
          last_name: student.LAST_NAME,
          role: "student",
        });

        console.log("✅ Student login successful (legacy):", student.ERP_ID);
        return res.json({
          message: "Login successful",
          token,
          user: {
            erpId: student.ERP_ID,
            firstName: student.FIRST_NAME,
            lastName: student.LAST_NAME,
            email: student.EMAIL,
            role: "student",
          },
        });
      }
    }

    if (role === "librarian" && erpId) {
      const result = await query(
        `SELECT librarian_id, first_name, last_name, email
         FROM LIBRARIAN
         WHERE librarian_id = :id AND pass = :pw`,
        { id: erpId, pw: password }
      );

      if (result.rows.length > 0) {
        const librarian = result.rows[0];
        const token = generateToken({
          librarian_id: librarian.LIBRARIAN_ID,
          email: librarian.EMAIL,
          first_name: librarian.FIRST_NAME,
          last_name: librarian.LAST_NAME,
          role: "librarian",
        });

        console.log("✅ Librarian login successful (legacy):", librarian.LIBRARIAN_ID);
        return res.json({
          message: "Login successful",
          token,
          user: {
            librarianId: librarian.LIBRARIAN_ID,
            firstName: librarian.FIRST_NAME,
            lastName: librarian.LAST_NAME,
            email: librarian.EMAIL,
            role: "librarian",
          },
        });
      }
    }

    // If we reach here, credentials are invalid
    return res.status(401).json({ error: "Invalid credentials" });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===== LEGACY ENDPOINTS (kept for backward compatibility) =====
router.post("/student", async (req, res) => {
  req.body.role = "student";
  return router.handle(req, res);
});

router.post("/librarian", async (req, res) => {
  req.body.role = "librarian";
  return router.handle(req, res);
});

router.post("/admin", async (req, res) => {
  req.body.role = "admin";
  return router.handle(req, res);
});

// ===== FORGOT PASSWORD ENDPOINT =====
router.post("/forgot-password", async (req, res) => {
  const { email, role } = req.body;
  console.log("🔑 Forgot password request:", { email, role });

  try {
    if (!email || !role) {
      return res.status(400).json({ error: "Email and role are required" });
    }

    if (!["student", "librarian", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    let userFound = false;
    let firstName = "";

    // Check USERS table first (for registered users)
    const userResult = await query(
      `SELECT user_id, first_name, email FROM USERS WHERE email = :email AND role = :role AND status = 'approved'`,
      { email, role }
    );

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      firstName = user.FIRST_NAME;
      userFound = true;

      // Update reset token in USERS table
      await query(
        `UPDATE USERS SET reset_token = :token, reset_token_expiry = :expiry WHERE user_id = :id`,
        { token: resetToken, expiry: tokenExpiry, id: user.USER_ID }
      );
      await query('COMMIT');
    } else {
      // Check legacy tables (hardcoded users)
      if (role === "student") {
        const result = await query(
          `SELECT erp_id, first_name FROM STUDENTS WHERE email = :email`,
          { email }
        );
        if (result.rows.length > 0) {
          firstName = result.rows[0].FIRST_NAME;
          userFound = true;
          await query(
            `UPDATE STUDENTS SET reset_token = :token, reset_token_expiry = :expiry WHERE email = :email`,
            { token: resetToken, expiry: tokenExpiry, email }
          );
          await query('COMMIT');
        }
      } else if (role === "librarian") {
        const result = await query(
          `SELECT librarian_id, first_name FROM LIBRARIAN WHERE email = :email`,
          { email }
        );
        if (result.rows.length > 0) {
          firstName = result.rows[0].FIRST_NAME;
          userFound = true;
          await query(
            `UPDATE LIBRARIAN SET reset_token = :token, reset_token_expiry = :expiry WHERE email = :email`,
            { token: resetToken, expiry: tokenExpiry, email }
          );
          await query('COMMIT');
        }
      } else if (role === "admin") {
        const result = await query(
          `SELECT admin_id, first_name FROM ADMINS WHERE email = :email`,
          { email }
        );
        if (result.rows.length > 0) {
          firstName = result.rows[0].FIRST_NAME;
          userFound = true;
          await query(
            `UPDATE ADMINS SET reset_token = :token, reset_token_expiry = :expiry WHERE email = :email`,
            { token: resetToken, expiry: tokenExpiry, email }
          );
          await query('COMMIT');
        }
      }
    }

    if (userFound) {
      // Send reset email
      await sendPasswordResetEmail(email, resetToken, firstName);
      console.log("✅ Reset token generated and email sent");
      return res.json({ message: "Password reset link sent to your email" });
    } else {
      // Don't reveal if email doesn't exist (security best practice)
      return res.json({ message: "If an account with that email exists, a reset link has been sent" });
    }
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    res.status(500).json({ error: "Failed to process password reset request" });
  }
});

// ===== RESET PASSWORD ENDPOINT =====
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  console.log("🔄 Reset password attempt with token");

  try {
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    const now = new Date();
    let userUpdated = false;

    // Check USERS table
    const userResult = await query(
      `SELECT user_id, email, role, first_name FROM USERS 
       WHERE reset_token = :token AND reset_token_expiry > :now`,
      { token, now }
    );

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await query(
        `UPDATE USERS SET password_hash = :hash, reset_token = NULL, reset_token_expiry = NULL 
         WHERE user_id = :id`,
        { hash: hashedPassword, id: user.USER_ID }
      );
      await query('COMMIT');
      userUpdated = true;
      console.log("✅ Password reset successful for USERS table:", user.EMAIL);
    } else {
      // Check legacy tables
      const studentResult = await query(
        `SELECT erp_id, email FROM STUDENTS 
         WHERE reset_token = :token AND reset_token_expiry > :now`,
        { token, now }
      );

      if (studentResult.rows.length > 0) {
        const student = studentResult.rows[0];
        await query(
          `UPDATE STUDENTS SET pass = :pass, reset_token = NULL, reset_token_expiry = NULL 
           WHERE erp_id = :id`,
          { pass: newPassword, id: student.ERP_ID }
        );
        await query('COMMIT');
        userUpdated = true;
        console.log("✅ Password reset successful for student:", student.EMAIL);
      } else {
        const librarianResult = await query(
          `SELECT librarian_id, email FROM LIBRARIAN 
           WHERE reset_token = :token AND reset_token_expiry > :now`,
          { token, now }
        );

        if (librarianResult.rows.length > 0) {
          const librarian = librarianResult.rows[0];
          await query(
            `UPDATE LIBRARIAN SET pass = :pass, reset_token = NULL, reset_token_expiry = NULL 
             WHERE librarian_id = :id`,
            { pass: newPassword, id: librarian.LIBRARIAN_ID }
          );
          await query('COMMIT');
          userUpdated = true;
          console.log("✅ Password reset successful for librarian:", librarian.EMAIL);
        } else {
          const adminResult = await query(
            `SELECT admin_id, email FROM ADMINS 
             WHERE reset_token = :token AND reset_token_expiry > :now`,
            { token, now }
          );

          if (adminResult.rows.length > 0) {
            const admin = adminResult.rows[0];
            await query(
              `UPDATE ADMINS SET pass = :pass, reset_token = NULL, reset_token_expiry = NULL 
               WHERE admin_id = :id`,
              { pass: newPassword, id: admin.ADMIN_ID }
            );
            await query('COMMIT');
            userUpdated = true;
            console.log("✅ Password reset successful for admin:", admin.EMAIL);
          }
        }
      }
    }

    if (userUpdated) {
      return res.json({ message: "Password reset successful. You can now login with your new password." });
    } else {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }
  } catch (err) {
    console.error("❌ Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

export default router;
