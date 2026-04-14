// CommentForm.js
// Lets a logged-in user post a comment on a project (POST /projects/:id/comments)
// Calls onCommentAdded(updatedProject) so the parent can refresh its state

import { useState } from "react";
import { addComment } from "../services/api";
import { useAuth } from "../services/AuthContext";

export default function CommentForm({ projectId, onCommentAdded }) {
  const { user } = useAuth();
  const [body,    setBody]    = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  // Guard: only logged-in users can comment
  if (!user) {
    return (
      <p className="muted">
        <a href="/login">Log in</a> to leave a comment.
      </p>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await addComment(projectId, { body });
      setBody("");
      onCommentAdded(res.data);   // res.data is the updated project
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post comment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="comment-form-row">
        <textarea
          rows={2}
          maxLength={300}
          placeholder="Add a comment… (max 300 chars)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button
          className="btn btn-green"
          type="submit"
          disabled={loading || !body.trim()}
        >
          {loading ? "…" : "Post"}
        </button>
      </div>
      <p className="char">{body.length}/300</p>
      {error && <p style={{ color: "var(--danger)", fontSize: "0.82rem" }}>{error}</p>}
    </form>
  );
}
