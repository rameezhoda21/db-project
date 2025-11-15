import express from "express";
import cors from "cors";
import { initDB } from "./config/db.js";
import { query } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import librarianRoutes from "./routes/librarian.js";
import studentRoutes from "./routes/student.js";
import adminRoutes from "./routes/admin.js";

const app = express();
app.use(cors());
app.use(express.json());

// Initialize DB pool
await initDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/librarian", librarianRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);

// Test route
app.get("/api/testdb", async (req, res) => {
  try {
    const result = await query("SELECT 'Connected to Oracle!' AS message FROM dual");
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/debug/librarians", async (req, res) => {
  try {
    const result = await query(`SELECT * FROM LIBRARIAN`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/debug/students", async (req, res) => {
  try {
    const result = await query(`SELECT * FROM STUDENTS`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/testbooks", async (req, res) => {
  try {
    const result = await query("SELECT * FROM BOOKS");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
