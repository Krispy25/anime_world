import { useState } from "react";
import AnimeModal from "./AnimeModal";

export default function AnimeCard({ anime, watchlist, onWatchlistChange }) {
  const [showModal, setShowModal] = useState(false);
  const inList = watchlist.some((w) => w.mal_id === anime.mal_id);

  return (
    <>
      <div className="anime-card" onClick={() => setShowModal(true)}>
        <div className="card-img-wrap">
          <img src={anime.images?.jpg?.image_url} alt={anime.title} loading="lazy" />
          {inList && <span className="in-list-badge">In List</span>}
        </div>
        <div className="card-info">
          <h3 title={anime.title}>{anime.title}</h3>
          <div className="card-meta">
            {anime.score && <span>★ {anime.score}</span>}
            {anime.episodes && <span>{anime.episodes} ep</span>}
          </div>
        </div>
      </div>
      {showModal && (
        <AnimeModal
          anime={anime}
          inList={inList}
          onClose={() => setShowModal(false)}
          onWatchlistChange={onWatchlistChange}
        />
      )}
    </>
  );
}
