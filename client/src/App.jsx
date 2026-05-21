import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Browse from "./pages/Browse";
import Watchlist from "./pages/Watchlist";
import Chat from "./pages/Chat";
import { getWatchlist } from "./api";
import "./index.css";

export default function App() {
  const [watchlist, setWatchlist] = useState([]);

  const refreshWatchlist = useCallback(async () => {
    try {
      const data = await getWatchlist();
      setWatchlist(data);
    } catch {
      console.warn("Backend not reachable, watchlist empty");
    }
  }, []);

  useEffect(() => { refreshWatchlist(); }, [refreshWatchlist]);

  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Browse watchlist={watchlist} onWatchlistChange={refreshWatchlist} />} />
          <Route path="/watchlist" element={<Watchlist watchlist={watchlist} onWatchlistChange={refreshWatchlist} />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
