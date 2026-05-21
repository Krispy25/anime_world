const express = require("express");
const router = express.Router();
const Anthropic = require("@anthropic-ai/sdk");
const db = require("../db");

const client = new Anthropic();

router.post("/", async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: "message required" });

  const watchlist = db.prepare("SELECT title, status, user_rating, notes FROM watchlist").all();

  const watchlistContext =
    watchlist.length > 0
      ? `The user's anime watchlist:\n${watchlist
          .map(
            (a) =>
              `- ${a.title} (status: ${a.status}${a.user_rating ? `, rated: ${a.user_rating}/10` : ""}${a.notes ? `, notes: "${a.notes}"` : ""})`
          )
          .join("\n")}`
      : "The user has no anime in their watchlist yet.";

  const systemPrompt = `You are AnimeBot, a knowledgeable and enthusiastic anime recommendation assistant.
You help users discover anime they'll love based on their preferences and watch history.
When recommending, always explain WHY you think they'd enjoy it based on what they've watched.
Keep responses concise and friendly. Recommend 3-5 anime max per response unless asked for more.

${watchlistContext}`;

  const messages = [
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: message },
  ];

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    res.json({ reply: response.content[0].text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
