const express = require("express");
const router = express.Router();

const CONSUMET_URL = process.env.CONSUMET_URL || "http://localhost:3000";

async function consumet(path) {
  const res = await fetch(`${CONSUMET_URL}${path}`);
  if (!res.ok) throw new Error(`Consumet error: ${res.status}`);
  return res.json();
}

// Search anime and return episode list
router.get("/episodes/:title", async (req, res) => {
  try {
    const search = await consumet(`/anime/zoro/${encodeURIComponent(req.params.title)}`);
    if (!search.results?.length) return res.status(404).json({ error: "Anime not found" });

    const topResult = search.results[0];
    const info = await consumet(`/anime/zoro/info?id=${topResult.id}`);
    res.json({ episodes: info.episodes || [], title: info.title });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get streaming sources for an episode
router.get("/sources/:episodeId", async (req, res) => {
  try {
    const sources = await consumet(
      `/anime/zoro/watch?episodeId=${encodeURIComponent(req.params.episodeId)}`
    );
    res.json(sources);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
