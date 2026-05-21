const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "anime_world.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS watchlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mal_id INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    image_url TEXT,
    score REAL,
    episodes INTEGER,
    status TEXT DEFAULT 'plan_to_watch',
    user_rating INTEGER,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;
