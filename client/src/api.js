import axios from "axios";

const BASE = "http://localhost:3001/api";

export const getWatchlist = () => axios.get(`${BASE}/watchlist`).then((r) => r.data);
export const addToWatchlist = (anime) => axios.post(`${BASE}/watchlist`, anime);
export const updateWatchlist = (mal_id, data) => axios.patch(`${BASE}/watchlist/${mal_id}`, data);
export const removeFromWatchlist = (mal_id) => axios.delete(`${BASE}/watchlist/${mal_id}`);
export const sendChat = (message, history) =>
  axios.post(`${BASE}/chat`, { message, history }).then((r) => r.data);

export const searchAnime = (query) =>
  fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=20`)
    .then((r) => r.json())
    .then((r) => r.data);

export const getTopAnime = () =>
  fetch("https://api.jikan.moe/v4/top/anime?limit=24")
    .then((r) => r.json())
    .then((r) => r.data);

export const getSeasonalAnime = () =>
  fetch("https://api.jikan.moe/v4/seasons/now?limit=24")
    .then((r) => r.json())
    .then((r) => r.data);
