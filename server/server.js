import express from "express";
import cors from "cors";
import { initDB } from "./config/db.js";

const app = express();
app.use(cors());
app.use(express.json());

// Initialize DB pool
await initDB();

// Routes
import authRoutes from "./routes/auth.js";
app.use("/api/auth", authRoutes);

// Test route
app.get("/api/testdb", async (req, res) => {
  try {
    const result = await query("SELECT 'Connected to Oracle!' AS message FROM dual");
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
