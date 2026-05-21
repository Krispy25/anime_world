require("dotenv").config();
const express = require("express");
const cors = require("cors");

const watchlistRouter = require("./routes/watchlist");
const chatRouter = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/watchlist", watchlistRouter);
app.use("/api/chat", chatRouter);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
