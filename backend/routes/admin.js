import express from "express";
import { query } from "../config/db.js";
import {
  addLibrarian,
  removeLibrarian,
  addStudent,
  removeStudent,
  getInventory,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/addlibrarian", addLibrarian);
router.delete("/removelibrarian/:id", removeLibrarian);
router.post("/addstudent", addStudent);
router.delete("/removestudent/:id", removeStudent);
router.get("/inventory", getInventory);

// Import new admin methods
import {
  getBorrows,
  getRecentActivities,
  getPendingRegistrations,
  approveRegistration,
  rejectRegistration,
} from "../controllers/adminController.js";

// New admin dashboard routes
router.get("/borrows", getBorrows);
router.get("/recent-activities", getRecentActivities);
router.get("/registrations", getPendingRegistrations);
router.post("/registrations/:id/approve", approveRegistration);
router.post("/registrations/:id/reject", rejectRegistration);

// ============================================================================
// FINE MANAGEMENT
// ============================================================================

// 💰 Get all unpaid fines
router.get("/fines", async (req, res) => {
  try {
    const result = await query(
      `SELECT f.fine_id, f.borrow_id, f.erp_id, f.fine_amount, f.paid, f.fine_date,
              s.first_name, s.last_name, s.email,
              bk.title as book_title, bk.author,
              b.issue_date, b.due_date, b.return_date
       FROM FINE f
       JOIN STUDENTS s ON f.erp_id = s.erp_id
       JOIN BORROW b ON f.borrow_id = b.borrow_id
       JOIN BOOKS bk ON b.book_id = bk.book_id
       WHERE f.paid = 0
       ORDER BY f.fine_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching fines:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Mark fine as paid
router.post("/fines/:fine_id/pay", async (req, res) => {
  const { fine_id } = req.params;

  try {
    // Get fine details
    const fineResult = await query(
      "SELECT fine_id, erp_id, fine_amount, paid FROM FINE WHERE fine_id = :id",
      { id: fine_id }
    );

    if (fineResult.rows.length === 0) {
      return res.status(404).json({ error: "Fine not found" });
    }

    const fine = fineResult.rows[0];

    if (fine.PAID === 1) {
      return res.status(400).json({ error: "Fine is already paid" });
    }

    // Update fine status to paid
    await query(
      "UPDATE FINE SET paid = 1 WHERE fine_id = :id",
      { id: fine_id }
    );

    // Reduce student's fine_due
    await query(
      "UPDATE STUDENTS SET fine_due = fine_due - :amount WHERE erp_id = :erp",
      { amount: fine.FINE_AMOUNT, erp: fine.ERP_ID }
    );

    await query("COMMIT");

    console.log(`✅ Fine ${fine_id} marked as paid for student ${fine.ERP_ID}`);
    res.json({ 
      message: "Fine marked as paid successfully",
      fineId: fine_id,
      amount: fine.FINE_AMOUNT
    });
  } catch (err) {
    console.error("❌ Error marking fine as paid:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
