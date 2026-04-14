// ProjectFeed.js
// Fetches all projects from GET /projects and renders them in a filterable grid
// Re-fetches every 30 seconds to give a "live" feel

import { useEffect, useState } from "react";
import { getProjects } from "../services/api";
import ProjectCard from "./ProjectCard";

const STATUSES = ["all", "idea", "planning", "building", "testing", "launching", "completed"];

export default function ProjectFeed() {
  const [projects, setProjects] = useState([]);
  const [filter,   setFilter]   = useState("all");
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  // Fetch on mount, then every 30 seconds
  useEffect(() => {
    fetchFeed();
    const interval = setInterval(fetchFeed, 30000);
    return () => clearInterval(interval);  // cleanup when unmounted
  }, []);

  async function fetchFeed() {
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch {
      setError("Could not load projects.");
    } finally {
      setLoading(false);
    }
  }

  // Apply status filter
  const shown = filter === "all"
    ? projects
    : projects.filter((p) => p.status === filter);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (error)   return <p className="empty">{error}</p>;

  return (
    <div>
      {/* Filter buttons */}
      <div className="filters">
        {STATUSES.map((s) => (
          <button
            key={s}
            className={`filter-btn ${filter === s ? "active" : ""}`}
            onClick={() => setFilter(s)}
          >
            {s === "all" ? "All" : s[0].toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Cards */}
      {shown.length === 0
        ? <p className="empty">No projects here yet. Be the first! 🚀</p>
        : <div className="grid">
            {shown.map((p) => <ProjectCard key={p._id} project={p} />)}
          </div>
      }
    </div>
  );
}
