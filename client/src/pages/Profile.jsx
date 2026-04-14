// Profile.js
// Shows a user's profile and their projects
// Owner can edit bio/name or delete their account

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, getUserProjects, updateUser, deleteAccount } from "../services/api";
import { useAuth } from "../services/AuthContext";
import ProjectCard from "../components/ProjectCard";

export default function Profile() {
  const { userId }              = useParams();
  const { user: me, logoutUser } = useAuth();
  const navigate                = useNavigate();

  const [profile,  setProfile]  = useState(null);
  const [projects, setProjects] = useState([]);
  const [editing,  setEditing]  = useState(false);
  const [form,     setForm]     = useState({ name: "", bio: "" });
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [saving,   setSaving]   = useState(false);

  const isOwner = me?.id === userId;

  useEffect(() => {
    Promise.all([getUser(userId), getUserProjects(userId)])
      .then(([u, p]) => {
        setProfile(u.data);
        setProjects(p.data);
        setForm({ name: u.data.name, bio: u.data.bio || "" });
      })
      .catch(() => setError("Could not load profile."))
      .finally(() => setLoading(false));
  }, [userId]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateUser(userId, form);
      setProfile(res.data);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete your account? This cannot be undone.")) return;
    try {
      await deleteAccount(userId);
      logoutUser();
      navigate("/");
    } catch {
      setError("Could not delete account.");
    }
  }

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (error)   return <p className="empty">{error}</p>;

  return (
    <div className="page">
      {/* ── Profile card ── */}
      <div className="card profile-card">
        <div className="profile-avatar">
          {profile?.name?.charAt(0).toUpperCase()}
        </div>

        {editing ? (
          /* Edit form */
          <form onSubmit={handleSave} style={{ width: "100%", maxWidth: 380 }}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Bio (max 300)</label>
              <textarea
                rows={3}
                maxLength={300}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button className="btn btn-green" type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </button>
              <button className="btn btn-outline" type="button" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* View mode */
          <>
            <h2>{profile?.name}</h2>
            <p className="email">{profile?.email}</p>
            <p className="bio">{profile?.bio || "No bio yet."}</p>
            {isOwner && (
              <div className="profile-btns">
                <button className="btn btn-outline" onClick={() => setEditing(true)}>Edit Profile</button>
                <button className="btn btn-danger"  onClick={handleDelete}>Delete Account</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── User's projects ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 className="section-title" style={{ margin: 0 }}>
          Projects by {profile?.name}
        </h2>
        {isOwner && (
          <button className="btn btn-green" onClick={() => navigate("/projects/new")}>
            + New
          </button>
        )}
      </div>

      {projects.length === 0
        ? <p className="empty">No projects yet.</p>
        : <div className="grid">
            {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
          </div>
      }
    </div>
  );
}
