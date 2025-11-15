import { db } from "../config/db.js";

export const issueBook = (req, res) => {
  res.json({ message: "Book issued (mock)" });
};

export const returnBook = (req, res) => {
  res.json({ message: "Book returned (mock)" });
};

export const addBook = (req, res) => {
  const newBook = req.body;
  newBook.id = db.books.length + 1;
  db.books.push(newBook);
  res.json({ message: "Book added", book: newBook });
};

export const removeBook = (req, res) => {
  const index = db.books.findIndex((b) => b.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Book not found" });
  db.books.splice(index, 1);
  res.json({ message: "Book removed" });
};

export const applyFine = (req, res) => {
  res.json({ message: "Fine applied (mock)" });
};
