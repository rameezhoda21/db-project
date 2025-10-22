import express from "express";
import {
  getAllBooks,
  viewBookDetails,
  borrowBook,
  reserveBook,
  payFine,
} from "../controllers/studentController.js";

const router = express.Router();

router.get("/books", getAllBooks);
router.get("/books/:id", viewBookDetails);
router.post("/borrow/:id", borrowBook);
router.post("/reserve/:id", reserveBook);
router.post("/payfine", payFine);

export default router;
