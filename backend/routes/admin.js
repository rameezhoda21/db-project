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

export default router;
