import { useState, useEffect, useCallback } from "react";
import { getTopAnime, getSeasonalAnime, searchAnime } from "../api";
import AnimeCard from "../components/AnimeCard";

export default function Browse({ watchlist, onWatchlistChange }) {
  const [animeList, setAnimeList] = useState([]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("top");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = tab === "top" ? await getTopAnime() : await getSeasonalAnime();
      setAnimeList(data || []);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return load();
    setLoading(true);
    try {
      const data = await searchAnime(query);
      setAnimeList(data || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="browse-header">
        <div className="tabs">
          <button className={tab === "top" ? "active" : ""} onClick={() => { setTab("top"); setQuery(""); }}>Top Anime</button>
          <button className={tab === "seasonal" ? "active" : ""} onClick={() => { setTab("seasonal"); setQuery(""); }}>This Season</button>
        </div>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anime..."
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : (
        <div className="grid">
          {animeList.map((a) => (
            <AnimeCard
              key={a.mal_id}
              anime={a}
              watchlist={watchlist}
              onWatchlistChange={onWatchlistChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
