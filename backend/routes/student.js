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

// 🔹 Create borrow request (PENDING status - needs librarian approval)
router.post("/borrow", async (req, res) => {
  const { erp_id, book_id } = req.body;
  console.log("📖 Borrow request - ERP:", erp_id, "Book:", book_id);
  try {
    // Check current active borrows (PENDING + ISSUED)
    const activeBorrows = await query(
      "SELECT COUNT(*) as count FROM BORROW WHERE erp_id = :erp AND status IN ('PENDING', 'ISSUED')",
      { erp: erp_id }
    );
    
    const currentBorrowCount = activeBorrows.rows[0].COUNT;
    const MAX_BORROW_LIMIT = 3;
    
    if (currentBorrowCount >= MAX_BORROW_LIMIT) {
      return res.status(400).json({ 
        error: `You have reached the maximum borrow limit of ${MAX_BORROW_LIMIT} books. Please return a book before borrowing another.` 
      });
    }
    
    await query(
      "INSERT INTO BORROW (borrow_id, erp_id, book_id, status) VALUES (borrow_seq.NEXTVAL, :erp, :book, 'PENDING')",
      { erp: erp_id, book: book_id }
    );
    console.log("✅ Borrow request created (pending approval)");
    res.json({ message: "Request submitted! Go to the counter to collect your book." });
  } catch (err) {
    console.error("❌ Error creating borrow request:", err);
    
    // Extract user-friendly message from Oracle error
    let errorMessage = err.message;
    
    // Check if it's an Oracle error with a custom message
    if (errorMessage.includes('ORA-20001')) {
      // Fine error - extract the message after ORA-20001:
      const match = errorMessage.match(/ORA-20001:\s*(.+?)(?:\n|ORA-|$)/);
      errorMessage = match ? match[1].trim() : "You have outstanding fines. Please pay fines before borrowing.";
    } else if (errorMessage.includes('ORA-20004')) {
      // Already borrowed same book error
      const match = errorMessage.match(/ORA-20004:\s*(.+?)(?:\n|ORA-|$)/);
      errorMessage = match ? match[1].trim() : "You have already borrowed this book.";
    } else if (errorMessage.includes('ORA-20003')) {
      // Max borrow limit error
      const match = errorMessage.match(/ORA-20003:\s*(.+?)(?:\n|ORA-|$)/);
      errorMessage = match ? match[1].trim() : "You have reached the maximum borrow limit.";
    } else if (errorMessage.includes('ORA-20002')) {
      // Book unavailable error
      const match = errorMessage.match(/ORA-20002:\s*(.+?)(?:\n|ORA-|$)/);
      errorMessage = match ? match[1].trim() : "This book is currently unavailable.";
    }
    
    res.status(400).json({ error: errorMessage });
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