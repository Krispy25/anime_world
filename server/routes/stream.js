const express = require("express");
const router = express.Router();
const { ANIME } = require("@consumet/extensions");

const gogoanime = new ANIME.Gogoanime();

// Search for anime and return episodes
router.get("/episodes/:title", async (req, res) => {
  try {
    const results = await gogoanime.search(req.params.title);
    if (!results.results?.length) return res.status(404).json({ error: "Anime not found" });

    const first = results.results[0];
    const info = await gogoanime.fetchAnimeInfo(first.id);
    res.json({ episodes: info.episodes || [], title: info.title });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get streaming sources for a specific episode
router.get("/sources/:episodeId", async (req, res) => {
  try {
    const sources = await gogoanime.fetchEpisodeSources(
      decodeURIComponent(req.params.episodeId)
    );
    res.json(sources);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
