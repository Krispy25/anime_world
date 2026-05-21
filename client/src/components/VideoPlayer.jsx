import { useState, useEffect } from "react";
import { getEpisodes, getStreamSources } from "../api";

export default function VideoPlayer({ anime, onClose }) {
  const [episodes, setEpisodes] = useState([]);
  const [selectedEp, setSelectedEp] = useState(null);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getEpisodes(anime.title)
      .then((data) => setEpisodes(data.episodes))
      .catch(() => setError("Couldn't find streaming sources for this anime."))
      .finally(() => setLoading(false));
  }, [anime.title]);

  const handleEpisodeSelect = async (ep) => {
    setSelectedEp(ep);
    setLoadingVideo(true);
    setSources([]);
    try {
      const data = await getStreamSources(ep.id);
      setSources(data.sources || []);
    } catch {
      setError("Couldn't load episode sources.");
    } finally {
      setLoadingVideo(false);
    }
  };

  const bestSource = sources.find((s) => s.quality === "1080p")
    || sources.find((s) => s.quality === "720p")
    || sources[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="player-modal" onClick={(e) => e.stopPropagation()}>
        <div className="player-header">
          <h2>{anime.title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="player-layout">
          {/* Episode List */}
          <div className="episode-list">
            {loading && <p className="loading-text">Loading episodes...</p>}
            {error && <p className="error-text">{error}</p>}
            {!loading && !error && episodes.length === 0 && (
              <p className="loading-text">No episodes found.</p>
            )}
            {episodes.map((ep) => (
              <button
                key={ep.id}
                className={`episode-btn ${selectedEp?.id === ep.id ? "active" : ""}`}
                onClick={() => handleEpisodeSelect(ep)}
              >
                EP {ep.number}
              </button>
            ))}
          </div>

          {/* Video Area */}
          <div className="video-area">
            {!selectedEp && (
              <div className="video-placeholder">
                <span>Select an episode to watch</span>
              </div>
            )}
            {selectedEp && loadingVideo && (
              <div className="video-placeholder">
                <span>Loading stream...</span>
              </div>
            )}
            {selectedEp && !loadingVideo && bestSource && (
              <video
                key={bestSource.url}
                controls
                autoPlay
                className="video-player"
                src={bestSource.url}
              >
                Your browser does not support the video tag.
              </video>
            )}
            {selectedEp && !loadingVideo && !bestSource && (
              <div className="video-placeholder">
                <span>No playable source found for this episode.</span>
              </div>
            )}
            {selectedEp && (
              <div className="quality-options">
                {sources.map((s, i) => (
                  <span key={i} className={`quality-tag ${bestSource?.url === s.url ? "active" : ""}`}>
                    {s.quality}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
