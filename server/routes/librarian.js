import express from "express";
import { query } from "../config/db.js";
const router = express.Router();

// 🔹 View all borrowed books (active)
router.get("/borrowed", async (req, res) => {
  try {
    const result = await query("SELECT * FROM BorrowedBooks");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 View overdue borrows
router.get("/overdue", async (req, res) => {
  try {
    const result = await query("SELECT * FROM Overdue_Borrows");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Add a new book
router.post("/books/add", async (req, res) => {
  const { title, author, genre, year_published, available_copies } = req.body;
  try {
    await query(
      `INSERT INTO BOOKS (title, author, genre, year_published, available_copies)
       VALUES (:t, :a, :g, :y, :c)`,
      [title, author, genre, year_published, available_copies]
    );
    res.json({ message: "Book added successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Remove a book
router.delete("/books/:book_id", async (req, res) => {
  try {
    await query("DELETE FROM BOOKS WHERE book_id = :id", [req.params.book_id]);
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Issue a manual fine (trigger updates student's fine_due)
router.post("/fine", async (req, res) => {
  const { erp_id, librarian_id, borrow_id, fine_amount, reason } = req.body;
  try {
    await query(
      `INSERT INTO FINE (erp_id, librarian_id, borrow_id, fine_amount, fine_reason, fine_date, paid)
       VALUES (:e, :l, :b, :a, :r, SYSDATE, 0)`,
      [erp_id, librarian_id, borrow_id, fine_amount, reason]
    );
    res.json({ message: "Fine issued successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
