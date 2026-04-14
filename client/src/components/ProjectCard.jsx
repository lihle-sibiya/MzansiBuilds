// ProjectCard.js
// Shows a single project summary — used in ProjectFeed and Profile

import { useNavigate } from "react-router-dom";

// Map each status to a CSS badge class
const STATUS_BADGE = {
  idea:      "badge badge-muted",
  planning:  "badge badge-yellow",
  building:  "badge badge-blue",
  testing:   "badge badge-orange",
  launching: "badge badge-purple",
  completed: "badge badge-green",
};

const STATUS_ICON = {
  idea: "💡", planning: "🗺️", building: "🔨",
  testing: "🧪", launching: "🚀", completed: "✅",
};

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <div
      className="card pcard"
      onClick={() => navigate(`/projects/${project._id}`)}
    >
      {/* Status + support needed */}
      <div className="pcard-top">
        <span className={STATUS_BADGE[project.status]}>
          {STATUS_ICON[project.status]} {project.status}
        </span>
        {project.supportNeeded && project.supportNeeded !== "None" && (
          <span className="badge badge-blue">🤝 {project.supportNeeded}</span>
        )}
      </div>

      {/* Title */}
      <h3>{project.title}</h3>

      {/* Short description — cut at 110 characters */}
      <p>
        {project.description.length > 110
          ? project.description.slice(0, 110) + "…"
          : project.description}
      </p>

      {/* Tech tags */}
      {project.tags?.length > 0 && (
        <div className="tags" style={{ marginBottom: "0.6rem" }}>
          {project.tags.slice(0, 4).map((t) => (
            <span key={t} className="tag">#{t}</span>
          ))}
        </div>
      )}

      {/* Footer: developer name + stats */}
      <div className="pcard-footer">
        <span className="pcard-dev">👤 {project.developer?.name || "Dev"}</span>
        <div className="pcard-stats">
          <span>💬 {project.comments?.length || 0}</span>
          <span>🙌 {project.collaborators?.length || 0}</span>
          <span>🏁 {project.milestones?.length || 0}</span>
        </div>
      </div>
    </div>
  );
}
