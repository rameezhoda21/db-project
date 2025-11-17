import { query } from "../config/db.js";
import express from "express";

const router = express.Router();

// ===== Student Login =====
router.post("/student", async (req, res) => {
  const { erpId, password } = req.body;
  console.log("🔍 Student login attempt:", { erpId, password });
  
  try {
    const result = await query(
      `SELECT erp_id, first_name, last_name, email 
   FROM STUDENTS 
   WHERE erp_id = :erp AND pass = :pw`,
      { erp: erpId, pw: password }
    );

    console.log("📊 Query result:", result.rows);

    if (result.rows.length === 0)
      return res.status(401).json({ error: "Invalid ERP ID or password" });

    const user = result.rows[0];
    res.json({ message: "Login successful", user, role: "student" });
  } catch (err) {
    console.error("❌ Student login error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===== Librarian Login =====
router.post("/librarian", async (req, res) => {
  const { erpId, password } = req.body; // erpId is actually librarian_id (numeric)
  console.log("🔍 Librarian login attempt:", { erpId, password });
  
  try {
    const result = await query(
      `SELECT librarian_id, first_name, last_name, email
       FROM LIBRARIAN
       WHERE librarian_id = :id AND pass = :pw`,
      { id: erpId, pw: password }
    );

    console.log("📊 Query result:", result.rows);

    if (result.rows.length === 0)
      return res.status(401).json({ error: "Invalid ID or password" });

    const user = result.rows[0];
    res.json({ message: "Login successful", user, role: "librarian" });
  } catch (err) {
    console.error("❌ Librarian login error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===== Admin Login =====
router.post("/admin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await query(
      `SELECT admin_id, username, email
       FROM ADMIN
       WHERE username = :user AND pass = :pw`,
      { user: username, pw: password }
    );

    if (result.rows.length === 0)
      return res.status(401).json({ error: "Invalid username or password" });

    const user = result.rows[0];
    res.json({ message: "Login successful", user, role: "admin" });
  } catch (err) {
    console.error("❌ Admin login error:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
