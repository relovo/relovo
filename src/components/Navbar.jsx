import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const linkStyle = (path) => ({
    color: "white",
    textDecoration: "none",
    fontWeight: location.pathname === path ? "700" : "500",
    padding: "8px 14px",
    borderRadius: "8px",
    background:
      location.pathname === path
        ? "rgba(255,255,255,0.2)"
        : "transparent",
  });

  return (
    <nav
      style={{
        background: "#ff8c00",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <Link
        to="/"
        style={{
          color: "white",
          textDecoration: "none",
          fontSize: "26px",
          fontWeight: "bold",
        }}
      >
        Relovo 🛒
      </Link>

      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <Link to="/" style={linkStyle("/")}>
          🏠 Home
        </Link>

        <Link to="/orders" style={linkStyle("/orders")}>
          📦 Orders
        </Link>

        <Link to="/profile" style={linkStyle("/profile")}>
          👤 Profile
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;