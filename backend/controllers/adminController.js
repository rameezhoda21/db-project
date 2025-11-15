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
