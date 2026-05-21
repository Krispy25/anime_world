import { useState } from "react";
import { updateWatchlist, removeFromWatchlist } from "../api";

const STATUS_OPTIONS = ["plan_to_watch", "watching", "completed", "dropped"];
const STATUS_LABELS = {
  plan_to_watch: "Plan to Watch",
  watching: "Watching",
  completed: "Completed",
  dropped: "Dropped",
};

export default function Watchlist({ watchlist, onWatchlistChange }) {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? watchlist : watchlist.filter((a) => a.status === filter);

  const handleStatus = async (mal_id, status) => {
    await updateWatchlist(mal_id, { status });
    onWatchlistChange();
  };

  const handleRating = async (mal_id, user_rating) => {
    await updateWatchlist(mal_id, { user_rating: parseInt(user_rating) });
    onWatchlistChange();
  };

  const handleRemove = async (mal_id) => {
    await removeFromWatchlist(mal_id);
    onWatchlistChange();
  };

  return (
    <div className="page">
      <h1 className="page-title">My Watchlist</h1>
      <div className="filter-tabs">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
          All ({watchlist.length})
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            className={filter === s ? "active" : ""}
            onClick={() => setFilter(s)}
          >
            {STATUS_LABELS[s]} ({watchlist.filter((a) => a.status === s).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No anime here yet. Browse and add some!</p>
        </div>
      ) : (
        <div className="watchlist-grid">
          {filtered.map((anime) => (
            <div key={anime.mal_id} className="watchlist-item">
              <img src={anime.image_url} alt={anime.title} />
              <div className="watchlist-item-details">
                <h3>{anime.title}</h3>
                <div className="watchlist-controls">
                  <select
                    value={anime.status}
                    onChange={(e) => handleStatus(anime.mal_id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                  <select
                    value={anime.user_rating || ""}
                    onChange={(e) => handleRating(anime.mal_id, e.target.value)}
                  >
                    <option value="">Rate</option>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}/10</option>
                    ))}
                  </select>
                  <button className="btn-remove" onClick={() => handleRemove(anime.mal_id)}>Remove</button>
                </div>
                {anime.score && <p className="mal-score">MAL Score: ★ {anime.score}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
