// Navbar.js
// Top navigation bar — shows different links depending on login state

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate             = useNavigate();

  function handleLogout() {
    logoutUser();
    navigate("/");
  }

  return (
    <nav>
      <Link to="/" className="nav-brand">⚡ MzansiBuilds</Link>

      <div className="nav-links">
        <Link to="/">Feed</Link>
        <Link to="/celebration">🎉 Wall</Link>

        {user ? (
          <>
            <Link to={`/profile/${user.id}`}>Profile</Link>
            <button className="btn btn-green" onClick={() => navigate("/projects/new")}>
              + New Project
            </button>
            <button className="btn btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <button className="btn btn-green" onClick={() => navigate("/signup")}>
              Join
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
