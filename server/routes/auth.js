import { query } from "../config/db.js";
import express from "express";

const router = express.Router();

// ===== Student Login =====
router.post("/student", async (req, res) => {
  const { erpId, password } = req.body;
  try {
    const result = await query(
      `SELECT erp_id, first_name, last_name, email 
       FROM STUDENTS 
       WHERE erp_id = :erp AND pass = :pw`,
      [erpId, password]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ error: "Invalid ERP ID or password" });

    const user = result.rows[0];
    res.json({ message: "Login successful", user, role: "student" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Librarian Login =====
router.post("/librarian", async (req, res) => {
  const { erpId, password } = req.body; // `erpId` field is reused for username/email input
  try {
    const result = await query(
      `SELECT librarian_id, first_name, last_name, email 
       FROM LIBRARIAN 
       WHERE email = :em AND pass = :pw`,
      [erpId, password]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ error: "Invalid email or password" });

    const user = result.rows[0];
    res.json({ message: "Login successful", user, role: "librarian" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
