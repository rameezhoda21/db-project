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
    // Query recent activities from BORROW table
    const result = await query(
      `SELECT 
         b.borrow_id,
         b.status,
         b.issue_date AS timestamp,
         s.first_name || ' ' || s.last_name AS user_name,
         'student' AS role,
         CASE 
           WHEN b.status = 'ISSUED' THEN 'Book Issued'
           WHEN b.status = 'RETURNED' THEN 'Book Returned'
           WHEN b.status = 'PENDING' THEN 'Borrow Request'
           ELSE b.status
         END AS action,
         'Book: ' || bk.title || ' by ' || bk.author AS details
       FROM BORROW b
       JOIN STUDENTS s ON b.erp_id = s.erp_id
       JOIN BOOKS bk ON b.book_id = bk.book_id
       WHERE b.issue_date IS NOT NULL OR b.status = 'PENDING'
       ORDER BY NVL(b.issue_date, SYSDATE) DESC
       FETCH FIRST 20 ROWS ONLY`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Recent activities error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get pending user registrations
export const getPendingRegistrations = async (req, res) => {
  try {
    const result = await query(
      `SELECT user_id, email, first_name, last_name, role, status, erp_id, created_at
       FROM USERS
       WHERE status = 'pending'
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approveRegistration = async (req, res) => {
  const { id } = req.params; // user_id
  const adminId = req.user?.userId || 1; // From JWT token or default to admin 1

  try {
    // Get user details
    const userResult = await query(
      `SELECT user_id, email, first_name, last_name, role, password_hash, erp_id
       FROM USERS
       WHERE user_id = :id AND status = 'pending'`,
      { id }
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found or already processed" });
    }

    const user = userResult.rows[0];

    // Auto-generate IDs and create entries in respective tables
    if (user.ROLE === "student") {
      // Use the ERP ID provided during signup
      const erpId = user.ERP_ID;
      
      if (!erpId) {
        return res.status(400).json({ error: "Student does not have an ERP ID" });
      }

      // Create student entry in STUDENTS table
      await query(
        `INSERT INTO STUDENTS (erp_id, first_name, last_name, email, pass, fine_due)
         VALUES (:erp, :fn, :ln, :em, 'approved_via_users', 0.00)`,
        { erp: erpId, fn: user.FIRST_NAME, ln: user.LAST_NAME, em: user.EMAIL }
      );

      // Update USERS table with approved status
      await query(
        `UPDATE USERS
         SET status = 'approved', approved_at = CURRENT_TIMESTAMP, approved_by = :adminId
         WHERE user_id = :id`,
        { adminId, id }
      );

      console.log(`✅ Student approved: ${user.EMAIL} -> ERP ${erpId}`);
    } else if (user.ROLE === "librarian") {
      // Generate new librarian ID using sequence
      const libResult = await query(`SELECT librarian_id_seq.NEXTVAL AS new_lib FROM DUAL`);
      const newLibId = libResult.rows[0].NEW_LIB;

      // Create librarian entry
      await query(
        `INSERT INTO LIBRARIAN (librarian_id, first_name, last_name, email, pass, admin_id)
         VALUES (:lib, :fn, :ln, :em, 'approved_via_users', :adminId)`,
        { lib: newLibId, fn: user.FIRST_NAME, ln: user.LAST_NAME, em: user.EMAIL, adminId }
      );

      // Update USERS table with librarian_id and approved status
      await query(
        `UPDATE USERS
         SET status = 'approved', librarian_id = :lib, approved_at = CURRENT_TIMESTAMP, approved_by = :adminId
         WHERE user_id = :id`,
        { lib: newLibId, adminId, id }
      );

      console.log(`✅ Librarian approved: ${user.EMAIL} -> ID ${newLibId}`);
    } else if (user.ROLE === "admin") {
      // For admin, just update status - they will login via USERS table
      await query(
        `UPDATE USERS
         SET status = 'approved', approved_at = CURRENT_TIMESTAMP, approved_by = :adminId
         WHERE user_id = :id`,
        { adminId, id }
      );

      console.log(`✅ Admin approved: ${user.EMAIL} - will login via USERS table`);
    }

    res.json({ message: "Registration approved successfully", email: user.EMAIL, role: user.ROLE });
  } catch (err) {
    console.error("❌ Approval error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const rejectRegistration = async (req, res) => {
  const { id } = req.params; // user_id

  try {
    const result = await query(
      `UPDATE USERS
       SET status = 'rejected'
       WHERE user_id = :id AND status = 'pending'`,
      { id }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "User not found or already processed" });
    }

    console.log(`❌ Registration rejected: user_id ${id}`);
    res.json({ message: "Registration rejected successfully" });
  } catch (err) {
    console.error("❌ Rejection error:", err);
    res.status(500).json({ error: err.message });
  }
};
