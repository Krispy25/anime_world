import { addToWatchlist, removeFromWatchlist } from "../api";

export default function AnimeModal({ anime, inList, onClose, onWatchlistChange }) {
  const handleAdd = async () => {
    await addToWatchlist({
      mal_id: anime.mal_id,
      title: anime.title,
      image_url: anime.images?.jpg?.image_url,
      score: anime.score,
      episodes: anime.episodes,
    });
    onWatchlistChange();
  };

  const handleRemove = async () => {
    await removeFromWatchlist(anime.mal_id);
    onWatchlistChange();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-content">
          <img src={anime.images?.jpg?.large_image_url} alt={anime.title} />
          <div className="modal-details">
            <h2>{anime.title}</h2>
            <div className="modal-meta">
              {anime.score && <span>★ {anime.score}</span>}
              {anime.episodes && <span>{anime.episodes} episodes</span>}
              {anime.status && <span>{anime.status}</span>}
              {anime.genres?.map((g) => <span key={g.mal_id} className="genre-tag">{g.name}</span>)}
            </div>
            <p className="synopsis">{anime.synopsis?.slice(0, 400)}{anime.synopsis?.length > 400 ? "..." : ""}</p>
            {anime.trailer?.url && (
              <a href={anime.trailer.url} target="_blank" rel="noreferrer" className="trailer-link">
                Watch Trailer ↗
              </a>
            )}
            <div className="modal-actions">
              {inList ? (
                <button className="btn btn-danger" onClick={handleRemove}>Remove from List</button>
              ) : (
                <button className="btn btn-primary" onClick={handleAdd}>+ Add to My List</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
