// ProjectDetails.js
// Full project view: details, milestones, comments, collaborate button
// Owner can edit, mark complete, delete
// Any logged-in user can comment or raise hand to collaborate

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProject, completeProject, deleteProject, addMilestone, requestCollab} from "../services/api";
import { useAuth } from "../services/AuthContext";
import CommentForm from "../components/CommentForm";

export default function ProjectDetails() {
  const { projectId }  = useParams();
  const { user }       = useAuth();
  const navigate       = useNavigate();

  const [project,  setProject]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [msg,      setMsg]      = useState("");

  // Milestone form state
  const [showMs,   setShowMs]   = useState(false);
  const [msTitle,  setMsTitle]  = useState("");
  const [msDesc,   setMsDesc]   = useState("");
  const [msSaving, setMsSaving] = useState(false);

  const isOwner = user && project?.developer?._id === user.id;

  useEffect(() => { fetchProject(); }, [projectId]);

  async function fetchProject() {
    try {
      const res = await getProject(projectId);
      setProject(res.data);
    } catch {
      setError("Project not found.");
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete() {
    if (!window.confirm("Mark as completed? 🎉")) return;
    try {
      const res = await completeProject(projectId);
      setProject(res.data.project);
      setMsg("🎉 Project completed! You're on the Celebration Wall!");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error.");
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this project?")) return;
    await deleteProject(projectId);
    navigate("/");
  }

  async function handleCollaborate() {
    try {
      const res = await requestCollab(projectId);
      setMsg(res.data.message);
      fetchProject();
    } catch (err) {
      setMsg(err.response?.data?.message || "Error.");
    }
  }

  async function handleAddMilestone(e) {
    e.preventDefault();
    setMsSaving(true);
    try {
      const res = await addMilestone(projectId, { title: msTitle, description: msDesc });
      setProject(res.data);
      setMsTitle(""); setMsDesc(""); setShowMs(false);
    } catch (err) {
      setMsg(err.response?.data?.message || "Could not add milestone.");
    } finally {
      setMsSaving(false);
    }
  }

  // if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (loading) {
  return (
    <div className="spinner-wrap">
      <div className="spinner" />
    </div>
  );
}
  if (error)   return <p className="empty">{error}</p>;

  return (
    <div className="page">
      {/* ── Header ── */}
      <div className="detail-header">
        <span className="badge badge-green">{project.status}</span>
        {project.supportNeeded !== "None" && (
          <span className="badge badge-blue" style={{ marginLeft: "0.4rem" }}>
            🤝 {project.supportNeeded}
          </span>
        )}
        <h1>{project.title}</h1>
        <p className="muted">
          by{" "}
          <span
            style={{ color: "var(--green)", cursor: "pointer" }}
            onClick={() => navigate(`/profile/${project.developer._id}`)}
          >
            {project.developer?.name}
          </span>
        </p>
        <p className="detail-desc">{project.description}</p>

        {project.tags?.length > 0 && (
          <div className="tags" style={{ marginBottom: "0.75rem" }}>
            {project.tags.map((t) => <span key={t} className="tag">#{t}</span>)}
          </div>
        )}

        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="badge badge-muted"
            style={{ width: "fit-content" }}
          >
            🔗 GitHub Repo
          </a>
        )}

        {msg && <div className="msg-success" style={{ marginTop: "0.75rem" }}>{msg}</div>}

        {/* Action buttons */}
        <div className="detail-actions">
          {isOwner && (
            <>
              <button className="btn btn-outline" onClick={() => navigate(`/projects/${projectId}/edit`)}>
                ✏️ Edit
              </button>
              {project.status !== "completed" && (
                <button className="btn btn-green" onClick={handleComplete}>
                  🎉 Mark Complete
                </button>
              )}
              <button className="btn btn-danger" onClick={handleDelete}>
                🗑️ Delete
              </button>
            </>
          )}
          {user && !isOwner && project.status !== "completed" && (
            <button className="btn btn-outline" onClick={handleCollaborate}>
              🙌 Raise Hand to Collaborate
            </button>
          )}
        </div>
      </div>

      {/* ── Milestones ── */}
      <div className="detail-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>🏁 Milestones ({project.milestones?.length || 0})</h3>
          {isOwner && (
            <button className="btn btn-outline" onClick={() => setShowMs(!showMs)}>
              {showMs ? "Cancel" : "+ Add"}
            </button>
          )}
        </div>

        {showMs && (
          <form onSubmit={handleAddMilestone} style={{ background: "var(--surface2)", padding: "1rem", borderRadius: "8px", marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <input
              placeholder="Milestone title *"
              value={msTitle}
              onChange={(e) => setMsTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="What did you achieve? (optional)"
              rows={2}
              maxLength={500}
              value={msDesc}
              onChange={(e) => setMsDesc(e.target.value)}
            />
            <button className="btn btn-green" type="submit" disabled={msSaving}>
              {msSaving ? "Adding…" : "Add Milestone"}
            </button>
          </form>
        )}

        <div className="milestone-list" style={{ marginTop: "0.75rem" }}>
          {project.milestones?.length === 0
            ? <p className="muted">No milestones yet.</p>
            : project.milestones.map((m, i) => (
                <div key={m._id || i} className="milestone-item">
                  <div className="ms-dot" />
                  <div className="ms-body">
                    <strong>{m.title}</strong>
                    {m.description && <p>{m.description}</p>}
                    <p className="ms-date">
                      {new Date(m.achievedAt || m.createdAt).toLocaleDateString("en-ZA")}
                    </p>
                  </div>
                </div>
              ))
          }
        </div>
      </div>

      {/* ── Comments ── */}
      <div className="detail-section">
        <h3>💬 Comments ({project.comments?.length || 0})</h3>
        <CommentForm
          projectId={projectId}
          onCommentAdded={(updated) => setProject(updated)}
        />
        <div className="comment-list">
          {project.comments?.length === 0
            ? <p className="muted">No comments yet — be the first!</p>
            : [...project.comments].reverse().map((c, i) => (
                <div key={c._id || i} className="comment-item">
                  <div className="comment-avatar">
                    {c.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="comment-body">
                    <div>
                      <strong>{c.username}</strong>
                      <span className="comment-date">
                        {new Date(c.createdAt).toLocaleDateString("en-ZA")}
                      </span>
                    </div>
                    <p>{c.body}</p>
                  </div>
                </div>
              ))
          }
        </div>
      </div>

      {/* ── Collaborators ── */}
      {project.collaborators?.length > 0 && (
        <div className="detail-section">
          <h3>🙌 Collaboration Requests ({project.collaborators.length})</h3>
          <p className="muted">
            {project.collaborators.length} developer(s) raised their hand to help!
          </p>
        </div>
      )}
    </div>
  );
}
