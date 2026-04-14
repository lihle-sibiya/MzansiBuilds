// Fetches GET /projects/celebration — all projects with status "completed"
// Displays them in a grid with a celebratory banner

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCelebration } from "../services/api";

export default function CelebrationWall() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCelebration()
      .then((res) => setProjects(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div>
      <div className="celeb-header">
        <h1>🎉 Celebration Wall</h1>
        <p>Developers who built in public and shipped!</p>
      </div>

      {projects.length === 0
        ? <p className="empty">No completed projects yet — be the first! 🚀</p>
        : <div className="grid">
            {projects.map((p) => (
              <div
                key={p._id}
                className="card celeb-card"
                onClick={() => navigate(`/projects/${p._id}`)}
              >
                <div className="celeb-banner">🎊 Shipped!</div>
                <div className="celeb-body">
                  <h3>{p.title}</h3>
                  <p className="celeb-dev">👤 {p.developer?.name}</p>
                  <p className="celeb-desc">
                    {p.description.slice(0, 100)}…
                  </p>
                  {p.tags?.length > 0 && (
                    <div className="tags" style={{ margin: "0.4rem 0" }}>
                      {p.tags.slice(0, 3).map((t) => (
                        <span key={t} className="tag">#{t}</span>
                      ))}
                    </div>
                  )}
                  <p className="celeb-date">
                    ✅ {new Date(p.completedAt).toLocaleDateString("en-ZA")}
                  </p>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}
