import { db } from "../config/db.js";

export const addLibrarian = (req, res) => {
  db.librarians.push(req.body);
  res.json({ message: "Librarian added", librarians: db.librarians });
};

export const removeLibrarian = (req, res) => {
  db.librarians.pop();
  res.json({ message: "Librarian removed" });
};

export const addStudent = (req, res) => {
  db.students.push(req.body);
  res.json({ message: "Student added", students: db.students });
};

export const removeStudent = (req, res) => {
  db.students.pop();
  res.json({ message: "Student removed" });
};

export const getInventory = (req, res) => {
  res.json(db.books);
};
