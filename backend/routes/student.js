import express from "express";
import { query } from "../config/db.js";
const router = express.Router();

// 🔹 Get available books
router.get("/books", async (req, res) => {
  try {
    const result = await query("SELECT * FROM AvailableBooks");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Borrow book (trigger checks fines and stock)
router.post("/borrow/:book_id", async (req, res) => {
  const { erp_id } = req.body;
  const { book_id } = req.params;
  try {
    await query(
      "INSERT INTO BORROW (erp_id, book_id) VALUES (:erp, :book)",
      { erp: erp_id, book: book_id }
    );
    res.json({ message: "Book borrowed successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Return a book (triggers will increase available copies)
router.post("/return", async (req, res) => {
  const { borrow_id } = req.body;
  try {
    await query(
      "UPDATE BORROW SET return_date = SYSDATE WHERE borrow_id = :id",
      { id: borrow_id } // ✅ Fixed: changed from [borrow_id] to { id: borrow_id }
    );
    res.json({ message: "Book returned successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Reserve a book
router.post("/reserve/:book_id", async (req, res) => {
  const { erp_id } = req.body;
  const { book_id } = req.params;
  try {
    await query(
      "INSERT INTO RESERVATIONS (erp_id, book_id, reservation_date) VALUES (:erp, :book, SYSDATE)",
      { erp: erp_id, book: book_id }
    );
    res.json({ message: "Book reserved successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 View borrowed books
router.get("/borrowed/:erp_id", async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM BorrowedBooks WHERE erp_id = :erp",
      { erp: req.params.erp_id } // ✅ Fixed: changed from [req.params.erp_id] to { erp: req.params.erp_id }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 View unpaid fines
router.get("/fines/:erp_id", async (req, res) => {
  try {
    const result = await query(
      `SELECT NVL(SUM(fine_amount), 0) as fine_due 
       FROM FINE 
       WHERE erp_id = :erp AND paid = 0`,
      { erp: req.params.erp_id }
    );
    res.json(result.rows[0]); // Returns { FINE_DUE: 0 }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Pay a fine (trigger updates STUDENTS.fine_due)
router.post("/payfine/:erp_id", async (req, res) => {
  const { erp_id } = req.params;
  try {
    // Pay all unpaid fines for this student
    await query(
      "UPDATE FINE SET paid = 1 WHERE erp_id = :erp AND paid = 0",
      { erp: erp_id }
    );
    res.json({ message: "Fine paid successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;