# AnimeWorld

A full-stack anime discovery app with AI-powered recommendations.

## Features
- Browse top and seasonal anime via the Jikan (MyAnimeList) API
- Search anime by title
- Personal watchlist with status tracking (watching, completed, plan to watch, dropped)
- Rate anime with your own score
- AI chat bot (powered by Claude) that recommends anime based on your watchlist

## Tech Stack
- **Frontend**: React + Vite, React Router
- **Backend**: Node.js + Express
- **Database**: SQLite (via better-sqlite3)
- **AI**: Anthropic Claude Haiku
- **Data**: Jikan API (free, no auth)

## Setup

### 1. Clone and install

```bash
# Backend
cd server
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

# Frontend
cd ../client
npm install
```

### 2. Run locally

```bash
# Terminal 1 — backend
cd server
npm run dev

# Terminal 2 — frontend
cd client
npm run dev
```

Frontend runs on http://localhost:5173  
Backend runs on http://localhost:3001

## Deployment
- **Frontend**: GitHub Pages (run `npm run build` in client, deploy `dist/`)
- **Backend**: Render.com free tier (set `ANTHROPIC_API_KEY` as env var)
