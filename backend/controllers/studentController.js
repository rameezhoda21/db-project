import { db } from "../config/db.js";

// 1. Browse all books
export const getAllBooks = (req, res) => {
  res.json(db.books);
};

// 2. View book details
export const viewBookDetails = (req, res) => {
  const book = db.books.find((b) => b.id == req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
};

// 3. Borrow book (max 3)
export const borrowBook = (req, res) => {
  const student = db.students[0];
  const book = db.books.find((b) => b.id == req.params.id);
  if (!book || book.copies <= 0)
    return res.status(400).json({ message: "Book unavailable" });

  if (student.borrowed.length >= 3)
    return res.status(400).json({ message: "Borrow limit reached" });

  book.copies--;
  student.borrowed.push({
    id: book.id,
    title: book.title,
    due: Date.now() + 14 * 24 * 60 * 60 * 1000, // 14 days
  });

  res.json({ message: "Book borrowed successfully", borrowed: student.borrowed });
};

// 4. Reserve book
export const reserveBook = (req, res) => {
  const student = db.students[0];
  const book = db.books.find((b) => b.id == req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  if (book.copies > 0)
    return res.status(400).json({ message: "Book available — no need to reserve" });

  student.reserved = student.reserved || [];
  if (student.reserved.length >= 2)
    return res.status(400).json({ message: "Reservation limit reached" });

  student.reserved.push(book);
  res.json({ message: "Book reserved", reserved: student.reserved });
};

// 5. Pay fine
export const payFine = (req, res) => {
  const student = db.students[0];
  student.fines = 0;
  res.json({ message: "Fine paid successfully" });
};
