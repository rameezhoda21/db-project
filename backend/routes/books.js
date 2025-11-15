import express from "express";
import { query } from "../config/db.js";

const router = express.Router();

// Get all books
router.get("/", async (req, res) => {
  try {
    const result = await query(`SELECT * FROM BOOKS`);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching books:", err);
    res.status(500).json({ error: err.message });
  }
});

// Optional: Get only available books (if your dashboard needs it)
router.get("/available", async (req, res) => {
  try {
    const result = await query(`SELECT * FROM AvailableBooks`);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching available books:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
