import express from "express";
import { query } from "../config/db.js";
const router = express.Router();

// 🔹 Get all books (for librarian dashboard)
router.get("/books", async (req, res) => {
  try {
   const result = await query(`
  SELECT 
    book_id AS "id",
    title AS "title",
    author AS "author",
    available_copies AS "copies"
  FROM BOOKS
  ORDER BY book_id
`);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching books:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Add a new book
router.post("/add", async (req, res) => {
  const { title, author, copies } = req.body;
  try {
    await query(
      `INSERT INTO BOOKS (book_id, title, author, available_copies)
       VALUES ((SELECT NVL(MAX(book_id), 0) + 1 FROM BOOKS), :t, :a, :c)`,
      { t: title, a: author, c: copies }
    );
    res.json({ message: "Book added successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Remove a book
router.delete("/remove/:id", async (req, res) => {
  const bookId = Number(req.params.id);

  if (isNaN(bookId)) {
    return res.status(400).json({ error: "Invalid book ID" });
  }

  try {
    const result = await query(
      `DELETE FROM BOOKS WHERE book_id = :id`,
      { id: bookId }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("❌ Delete book error:", err);
    res.status(500).json({ error: err.message });
  }
});



// 🔹 Borrowed books view
router.get("/borrowed", async (req, res) => {
  try {
    const result = await query(`SELECT * FROM BorrowedBooks`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Overdue books view
router.get("/overdue", async (req, res) => {
  try {
    const result = await query(`SELECT * FROM Overdue_Borrows`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Issue a fine
router.post("/fine", async (req, res) => {
  const { erp_id, librarian_id, borrow_id, fine_amount, reason } = req.body;
  try {
    await query(
      `INSERT INTO FINE (erp_id, librarian_id, borrow_id, fine_amount, fine_reason, fine_date, paid)
       VALUES (:e, :l, :b, :a, :r, SYSDATE, 0)`,
      { e: erp_id, l: librarian_id, b: borrow_id, a: fine_amount, r: reason }
    );
    res.json({ message: "Fine issued successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
