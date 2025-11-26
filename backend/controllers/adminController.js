import { query } from "../config/db.js";

export const addLibrarian = async (req, res) => {
  const { first_name, last_name, email, pass } = req.body;
  try {
    await query(
      `INSERT INTO LIBRARIAN (librarian_id, first_name, last_name, email, pass)
       VALUES ((SELECT NVL(MAX(librarian_id), 0) + 1 FROM LIBRARIAN), :fn, :ln, :em, :pw)`,
      { fn: first_name, ln: last_name, em: email, pw: pass }
    );
    res.json({ message: "Librarian added successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const removeLibrarian = async (req, res) => {
  const { id } = req.params;
  try {
    await query(`DELETE FROM LIBRARIAN WHERE librarian_id = :id`, { id });
    res.json({ message: "Librarian removed successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const addStudent = async (req, res) => {
  const { erp_id, first_name, last_name, email, pass } = req.body;
  try {
    await query(
      `INSERT INTO STUDENTS (erp_id, first_name, last_name, email, pass)
       VALUES (:erp, :fn, :ln, :em, :pw)`,
      { erp: erp_id, fn: first_name, ln: last_name, em: email, pw: pass }
    );
    res.json({ message: "Student added successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const removeStudent = async (req, res) => {
  const { id } = req.params;
  try {
    await query(`DELETE FROM STUDENTS WHERE erp_id = :id`, { id });
    res.json({ message: "Student removed successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getInventory = async (req, res) => {
  try {
    const result = await query(`SELECT * FROM BOOKS ORDER BY book_id`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBorrows = async (req, res) => {
  try {
    const result = await query(
      `SELECT b.borrow_id, b.erp_id, s.first_name || ' ' || s.last_name AS student_name,
              bk.book_id, bk.title, bk.author, b.issue_date, b.due_date, b.return_date, b.status,
              l.first_name || ' ' || l.last_name AS librarian_name
       FROM BORROW b
       JOIN STUDENTS s ON b.erp_id = s.erp_id
       JOIN BOOKS bk ON b.book_id = bk.book_id
       LEFT JOIN LIBRARIAN l ON b.librarian_id = l.librarian_id
       ORDER BY b.borrow_id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRecentActivities = async (req, res) => {
  try {
    // Combine borrows and fines into a single activity feed
    const borrowsResult = await query(
      `SELECT 'BORROW' AS activity_type, b.borrow_id AS id, 
              s.first_name || ' ' || s.last_name AS user_name, 'Student' AS user_role,
              bk.title AS book_title, b.status, b.issue_date AS activity_date,
              l.first_name || ' ' || l.last_name AS handled_by
       FROM BORROW b
       JOIN STUDENTS s ON b.erp_id = s.erp_id
       JOIN BOOKS bk ON b.book_id = bk.book_id
       LEFT JOIN LIBRARIAN l ON b.librarian_id = l.librarian_id
       WHERE b.issue_date IS NOT NULL OR b.status = 'PENDING'
       ORDER BY NVL(b.issue_date, b.approval_date) DESC
       FETCH FIRST 20 ROWS ONLY`
    );

    const finesResult = await query(
      `SELECT 'FINE' AS activity_type, f.fine_id AS id,
              s.first_name || ' ' || s.last_name AS user_name, 'Student' AS user_role,
              bk.title AS book_title, CASE WHEN f.paid = 1 THEN 'PAID' ELSE 'UNPAID' END AS status,
              f.fine_date AS activity_date, l.first_name || ' ' || l.last_name AS handled_by
       FROM FINE f
       JOIN STUDENTS s ON f.erp_id = s.erp_id
       JOIN LIBRARIAN l ON f.librarian_id = l.librarian_id
       JOIN BORROW b ON f.borrow_id = b.borrow_id
       JOIN BOOKS bk ON b.book_id = bk.book_id
       ORDER BY f.fine_date DESC
       FETCH FIRST 20 ROWS ONLY`
    );

    const activities = [...borrowsResult.rows, ...finesResult.rows]
      .sort((a, b) => new Date(b.ACTIVITY_DATE) - new Date(a.ACTIVITY_DATE))
      .slice(0, 20);

    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Placeholder for future registration feature
export const getPendingRegistrations = async (req, res) => {
  try {
    // This will be implemented when registration/authentication is added
    // For now, return empty array
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approveRegistration = async (req, res) => {
  // Placeholder - will be implemented with registration feature
  res.json({ message: "Registration approval feature coming soon" });
};

export const rejectRegistration = async (req, res) => {
  // Placeholder - will be implemented with registration feature
  res.json({ message: "Registration rejection feature coming soon" });
};
