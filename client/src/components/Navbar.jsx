import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const links = [
    { to: "/", label: "Browse" },
    { to: "/watchlist", label: "My List" },
    { to: "/chat", label: "AI Recs" },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">⛩</span> AnimeWorld
      </Link>
      <div className="navbar-links">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className={pathname === l.to ? "active" : ""}>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
