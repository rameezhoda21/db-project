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
router.post("/borrow", async (req, res) => {
  const { erp_id, book_id } = req.body;
  try {
    await query(
      "INSERT INTO BORROW (erp_id, book_id) VALUES (:erp, :book)",
      [erp_id, book_id]
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
      [borrow_id]
    );
    res.json({ message: "Book returned successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Reserve a book
router.post("/reserve", async (req, res) => {
  const { erp_id, book_id } = req.body;
  try {
    await query(
      "INSERT INTO RESERVATIONS (erp_id, book_id, reservation_date) VALUES (:erp, :book, SYSDATE)",
      [erp_id, book_id]
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
      [req.params.erp_id]
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
      "SELECT * FROM FINES_DUE WHERE erp_id = :erp",
      [req.params.erp_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Pay a fine (trigger updates STUDENTS.fine_due)
router.post("/fines/pay", async (req, res) => {
  const { fine_id } = req.body;
  try {
    await query("UPDATE FINE SET paid = 1 WHERE fine_id = :id", [fine_id]);
    res.json({ message: "Fine paid successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
