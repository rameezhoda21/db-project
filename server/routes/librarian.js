import express from "express";
import {
  issueBook,
  returnBook,
  addBook,
  removeBook,
  applyFine,
} from "../controllers/librarianController.js";

const router = express.Router();

router.post("/issue/:id", issueBook);
router.post("/return/:id", returnBook);
router.post("/add", addBook);
router.delete("/remove/:id", removeBook);
router.post("/fine/:studentId", applyFine);

export default router;
