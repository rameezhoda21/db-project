import { db } from "../config/db.js";

export const loginUser = (req, res) => {
  const { erpId, password, role } = req.body;

  if (role === "student") {
    const student = db.students.find(
      (s) => s.erpId === erpId && s.password === password
    );
    if (!student)
      return res.status(401).json({ message: "Invalid student credentials" });
    return res.json({ name: student.name, role: "student" });
  }

  if (role === "librarian") {
    const librarian = db.librarians.find(
      (l) => l.username === erpId && l.password === password
    );
    if (!librarian)
      return res.status(401).json({ message: "Invalid librarian credentials" });
    return res.json({ name: librarian.name, role: "librarian" });
  }

  res.status(400).json({ message: "Invalid role" });
};
