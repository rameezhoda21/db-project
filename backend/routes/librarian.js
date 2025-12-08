import express from "express";
import { query } from "../config/db.js";

const router = express.Router();

// ============================================================================
// BOOK MANAGEMENT
// ============================================================================

// 📚 Get all books in inventory
router.get("/books", async (req, res) => {
  try {
    const result = await query(
      `SELECT book_id, title, author, genre, year_published, available_copies
       FROM BOOKS 
       ORDER BY title`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching books:", err);
    res.status(500).json({ error: err.message });
  }
});

// ➕ Add new book to inventory
router.post("/books", async (req, res) => {
  const { title, author, genre, yearPublished, copies } = req.body;
  
  try {
    // Get next book_id
    const idResult = await query(
      "SELECT NVL(MAX(book_id), 0) + 1 as next_id FROM BOOKS"
    );
    const nextId = idResult.rows[0].NEXT_ID;

    await query(
      `INSERT INTO BOOKS (book_id, title, author, genre, year_published, available_copies) 
       VALUES (:id, :title, :author, :genre, :year, :copies)`,
      {
        id: nextId,
        title,
        author,
        genre,
        year: yearPublished,
        copies: copies
      }
    );

    res.json({ message: "Book added successfully", bookId: nextId });
  } catch (err) {
    console.error("❌ Error adding book:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update book details
router.put("/books/:book_id", async (req, res) => {
  const { book_id } = req.params;
  const { title, author, genre, yearPublished, copies } = req.body;

  try {
    await query(
      `UPDATE BOOKS 
       SET title = :title, author = :author, genre = :genre, 
           year_published = :year, available_copies = :copies
       WHERE book_id = :id`,
      {
        id: book_id,
        title,
        author,
        genre,
        year: yearPublished,
        copies: copies
      }
    );

    res.json({ message: "Book updated successfully" });
  } catch (err) {
    console.error("❌ Error updating book:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🗑️ Delete book from inventory
router.delete("/books/:book_id", async (req, res) => {
  const { book_id } = req.params;

  try {
    // Check if book has any active borrows
    const borrowCheck = await query(
      "SELECT COUNT(*) as borrow_count FROM BORROW WHERE book_id = :id AND status IN ('PENDING', 'ISSUED')",
      { id: book_id }
    );

    if (borrowCheck.rows[0].BORROW_COUNT > 0) {
      return res.status(400).json({ 
        error: "Cannot delete book: There are active borrow requests or issued copies. Please process returns first." 
      });
    }

    await query("DELETE FROM BOOKS WHERE book_id = :id", { id: book_id });
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting book:", err);
    if (err.message.includes("integrity constraint")) {
      res.status(400).json({ error: "Cannot delete book: It has borrow history or other references in the system." });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// ============================================================================
// BORROW MANAGEMENT (ISSUE & RETURN)
// ============================================================================

// 📋 Get all active borrows
router.get("/borrows", async (req, res) => {
  try {
    const result = await query(
      `SELECT b.borrow_id, b.erp_id, b.book_id, b.issue_date, b.due_date,
              s.first_name || ' ' || s.last_name as student_name,
              bk.title as book_title, bk.author
       FROM BORROW b
       JOIN STUDENTS s ON b.erp_id = s.erp_id
       JOIN BOOKS bk ON b.book_id = bk.book_id
       WHERE b.return_date IS NULL
       ORDER BY b.issue_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching borrows:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📋 Get borrow history (all borrows including returned)
router.get("/borrows/history", async (req, res) => {
  try {
    const result = await query(
      `SELECT b.borrow_id, b.erp_id, b.book_id, b.issue_date, b.due_date, b.return_date,
              s.first_name || ' ' || s.last_name as student_name,
              bk.title as book_title, bk.author,
              CASE 
                WHEN b.return_date IS NULL THEN 'Active'
                WHEN b.return_date > b.due_date THEN 'Returned Late'
                ELSE 'Returned On Time'
              END as status
       FROM BORROW b
       JOIN STUDENTS s ON b.erp_id = s.erp_id
       JOIN BOOKS bk ON b.book_id = bk.book_id
       ORDER BY b.issue_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching borrow history:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📤 Get all pending borrow requests (for Issue Requests page)
router.get("/requests/pending", async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        b.borrow_id,
        b.erp_id,
        b.book_id,
        s.first_name,
        s.last_name,
        s.email,
        bk.title as book_title,
        bk.author,
        bk.genre,
        bk.available_copies,
        b.status
       FROM BORROW b
       JOIN STUDENTS s ON b.erp_id = s.erp_id
       JOIN BOOKS bk ON b.book_id = bk.book_id
       WHERE b.status = 'PENDING'
       ORDER BY b.borrow_id ASC`
    );
    console.log(`📋 Found ${result.rows.length} pending requests`);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching pending requests:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Approve borrow request (change status from PENDING to ISSUED)
router.post("/requests/approve/:borrow_id", async (req, res) => {
  const { borrow_id } = req.params;
  const { librarian_id } = req.body;

  try {
    // Check if request exists and is pending
    const requestCheck = await query(
      "SELECT borrow_id, status, book_id FROM BORROW WHERE borrow_id = :id",
      { id: borrow_id }
    );

    if (requestCheck.rows.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (requestCheck.rows[0].STATUS !== 'PENDING') {
      return res.status(400).json({ error: "Request already processed" });
    }

    // Check if book is still available
    const bookCheck = await query(
      "SELECT available_copies FROM BOOKS WHERE book_id = :id",
      { id: requestCheck.rows[0].BOOK_ID }
    );

    if (bookCheck.rows[0].AVAILABLE_COPIES <= 0) {
      return res.status(400).json({ error: "No copies available" });
    }

    // Update request to ISSUED status (trigger will set dates and reduce copies)
    await query(
      `UPDATE BORROW 
       SET status = 'ISSUED', 
           approval_date = SYSDATE,
           librarian_id = :lib_id
       WHERE borrow_id = :id`,
      { lib_id: librarian_id, id: borrow_id }
    );

    console.log(`✅ Request ${borrow_id} approved by librarian ${librarian_id}`);
    res.json({ message: "Book issued successfully" });
  } catch (err) {
    console.error("❌ Error approving request:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📥 Return book (trigger will calculate fine if late)
router.post("/return", async (req, res) => {
  const { borrowId } = req.body;

  try {
    // Check if borrow exists and is active
    const borrowCheck = await query(
      `SELECT b.borrow_id, b.erp_id, b.book_id, b.due_date, b.return_date,
              bk.title, s.first_name || ' ' || s.last_name as student_name
       FROM BORROW b
       JOIN BOOKS bk ON b.book_id = bk.book_id
       JOIN STUDENTS s ON b.erp_id = s.erp_id
       WHERE b.borrow_id = :id`,
      { id: borrowId }
    );

    if (borrowCheck.rows.length === 0) {
      return res.status(404).json({ error: "Borrow record not found" });
    }

    const borrow = borrowCheck.rows[0];

    if (borrow.RETURN_DATE) {
      return res.status(400).json({ error: "Book already returned" });
    }

    // Update return date (trigger will handle fine calculation and available_copies)
    await query(
      "UPDATE BORROW SET return_date = SYSDATE WHERE borrow_id = :id",
      { id: borrowId }
    );

    // Check if a fine was generated
    const fineCheck = await query(
      "SELECT fine_amount FROM FINE WHERE borrow_id = :id",
      { id: borrowId }
    );

    let response = {
      message: "Book returned successfully",
      bookTitle: borrow.TITLE,
      studentName: borrow.STUDENT_NAME,
      onTime: new Date() <= new Date(borrow.DUE_DATE)
    };

    if (fineCheck.rows.length > 0) {
      response.fine = fineCheck.rows[0].FINE_AMOUNT;
      response.message += ` (Fine: Rs ${fineCheck.rows[0].FINE_AMOUNT})`;
    }

    res.json(response);
  } catch (err) {
    console.error("❌ Error returning book:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// STUDENT MANAGEMENT
// ============================================================================

// 👥 Get all students
router.get("/students", async (req, res) => {
  try {
    const result = await query(
      `SELECT erp_id, first_name, last_name, email, fine_due 
       FROM STUDENTS 
       ORDER BY erp_id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching students:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔍 Get student details with borrows and fines
router.get("/students/:erp_id", async (req, res) => {
  const { erp_id } = req.params;

  try {
    // Get student info
    const studentResult = await query(
      "SELECT * FROM STUDENTS WHERE erp_id = :erp",
      { erp: erp_id }
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Get active borrows
    const borrowsResult = await query(
      `SELECT b.borrow_id, b.book_id, b.issue_date, b.due_date,
              bk.title, bk.author
       FROM BORROW b
       JOIN BOOKS bk ON b.book_id = bk.book_id
       WHERE b.erp_id = :erp AND b.return_date IS NULL`,
      { erp: erp_id }
    );

    // Get unpaid fines
    const finesResult = await query(
      `SELECT f.fine_id, f.fine_amount, f.fine_reason, f.fine_date,
              bk.title as book_title
       FROM FINE f
       JOIN BORROW b ON f.borrow_id = b.borrow_id
       JOIN BOOKS bk ON b.book_id = bk.book_id
       WHERE f.erp_id = :erp AND f.paid = 0`,
      { erp: erp_id }
    );

    res.json({
      student: studentResult.rows[0],
      activeBorrows: borrowsResult.rows,
      unpaidFines: finesResult.rows
    });
  } catch (err) {
    console.error("❌ Error fetching student details:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
