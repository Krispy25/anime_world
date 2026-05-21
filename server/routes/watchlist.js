const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  const items = db.prepare("SELECT * FROM watchlist ORDER BY created_at DESC").all();
  res.json(items);
});

router.post("/", (req, res) => {
  const { mal_id, title, image_url, score, episodes } = req.body;
  if (!mal_id || !title) return res.status(400).json({ error: "mal_id and title required" });

  try {
    const stmt = db.prepare(`
      INSERT INTO watchlist (mal_id, title, image_url, score, episodes)
      VALUES (@mal_id, @title, @image_url, @score, @episodes)
    `);
    stmt.run({ mal_id, title, image_url, score, episodes });
    res.status(201).json({ message: "Added to watchlist" });
  } catch (e) {
    if (e.message.includes("UNIQUE")) return res.status(409).json({ error: "Already in watchlist" });
    res.status(500).json({ error: e.message });
  }
});

router.patch("/:mal_id", (req, res) => {
  const { status, user_rating, notes } = req.body;
  db.prepare(`
    UPDATE watchlist SET status = COALESCE(@status, status),
    user_rating = COALESCE(@user_rating, user_rating),
    notes = COALESCE(@notes, notes)
    WHERE mal_id = @mal_id
  `).run({ status, user_rating, notes, mal_id: req.params.mal_id });
  res.json({ message: "Updated" });
});

router.delete("/:mal_id", (req, res) => {
  db.prepare("DELETE FROM watchlist WHERE mal_id = ?").run(req.params.mal_id);
  res.json({ message: "Removed from watchlist" });
});

module.exports = router;
