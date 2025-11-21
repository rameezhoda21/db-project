import express from "express";
import { query } from "../config/db.js";
const router = express.Router();

// 🔹 Get all books (include reservation count)
router.get("/books", async (req, res) => {
  try {
    const result = await query(
      `SELECT 
         b.book_id as BOOK_ID,
         b.title as TITLE,
         b.author as AUTHOR,
         b.genre as GENRE,
         b.year_published as YEAR_PUBLISHED,
         b.available_copies as AVAILABLE_COPIES,
         (SELECT COUNT(*) FROM RESERVATIONS r WHERE r.book_id = b.book_id) AS RESERVATION_COUNT
       FROM BOOKS b`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Create borrow request (PENDING status - needs librarian approval)
router.post("/borrow", async (req, res) => {
  const { erp_id, book_id } = req.body;
  console.log("📖 Borrow request - ERP:", erp_id, "Book:", book_id);
  try {
    await query(
      "INSERT INTO BORROW (borrow_id, erp_id, book_id, status) VALUES (borrow_seq.NEXTVAL, :erp, :book, 'PENDING')",
      { erp: erp_id, book: book_id }
    );
    console.log("✅ Borrow request created (pending approval)");
    res.json({ message: "Request submitted! Go to the counter to collect your book." });
  } catch (err) {
    console.error("❌ Error creating borrow request:", err);
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

// 🔹 Reserve a book (prevents duplicate reservation by same student)
router.post("/reserve/:book_id", async (req, res) => {
  const { erp_id } = req.body;
  const { book_id } = req.params;
  try {
    // Check for existing reservation by this student for the same book
    const exists = await query(
      "SELECT COUNT(*) AS CNT FROM RESERVATIONS WHERE erp_id = :erp AND book_id = :book",
      { erp: erp_id, book: book_id }
    );
    const already = exists.rows[0]?.CNT
      ? parseInt(exists.rows[0].CNT, 10)
      : 0;

    if (already > 0) {
      return res.status(400).json({ error: "You have already reserved this book" });
    }

    // Insert reservation with sequence
    await query(
      "INSERT INTO RESERVATIONS (reservation_id, erp_id, book_id, reservation_date) VALUES (reservation_seq.NEXTVAL, :erp, :book, SYSDATE)",
      { erp: erp_id, book: book_id }
    );

    // Return updated reservation count
    const cntRes = await query(
      "SELECT COUNT(*) AS CNT FROM RESERVATIONS WHERE book_id = :book",
      { book: book_id }
    );
    const cnt = cntRes.rows[0]?.CNT ? parseInt(cntRes.rows[0].CNT, 10) : 0;

    res.json({ message: "Book reserved successfully", reservations_count: cnt });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 View my books (pending requests and issued books)
router.get("/borrowed/:erp_id", async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        b.borrow_id,
        b.book_id,
        bk.title,
        bk.author,
        bk.genre,
        b.status,
        b.issue_date,
        b.due_date,
        b.approval_date,
        b.return_date
       FROM BORROW b
       JOIN BOOKS bk ON b.book_id = bk.book_id
       WHERE b.erp_id = :erp AND b.status IN ('PENDING', 'ISSUED')
       ORDER BY 
         CASE b.status 
           WHEN 'PENDING' THEN 1
           WHEN 'ISSUED' THEN 2
         END,
         b.borrow_id DESC`,
      { erp: req.params.erp_id }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 View unpaid fines with details
router.get("/fines/:erp_id", async (req, res) => {
  try {
    // Get total fine amount
    const totalResult = await query(
      `SELECT NVL(SUM(fine_amount), 0) as fine_due 
       FROM FINE 
       WHERE erp_id = :erp AND paid = 0`,
      { erp: req.params.erp_id }
    );

    // Get detailed fine information with book details
    const detailsResult = await query(
      `SELECT 
        f.fine_id,
        f.fine_amount,
        f.paid,
        b.borrow_id,
        b.issue_date,
        b.due_date,
        b.return_date,
        bk.title as book_title,
        bk.author
       FROM FINE f
       JOIN BORROW b ON f.borrow_id = b.borrow_id
       JOIN BOOKS bk ON b.book_id = bk.book_id
       WHERE f.erp_id = :erp AND f.paid = 0
       ORDER BY b.return_date DESC`,
      { erp: req.params.erp_id }
    );

    res.json({
      FINE_DUE: totalResult.rows[0]?.FINE_DUE || 0,
      fines: detailsResult.rows || []
    });
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