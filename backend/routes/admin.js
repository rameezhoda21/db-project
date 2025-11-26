import express from "express";
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

export default router;
