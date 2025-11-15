app.get("/api/testbooks", async (req, res) => {
  try {
    const result = await query("SELECT * FROM BOOKS");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
