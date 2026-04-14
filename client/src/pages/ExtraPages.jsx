// ExtraPages.js

import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { login, signup, createProject, updateProject, getProject } from "../services/api";
import { useAuth } from "../services/AuthContext";
import CelebrationWall from "../components/CelebrationWall";

/* ================= LOGIN ================= */
export function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login(form);
      loginUser(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="form-box">
        <h2>Welcome back ⚡</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button className="btn btn-green" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p className="form-error">{error}</p>}

        <p>
          No account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

/* ================= SIGNUP ================= */
export function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signup(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="form-box">
        <h2>Join MzansiBuilds</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button className="btn btn-green" disabled={loading}>
            {loading ? "Creating..." : "Signup"}
          </button>
        </form>

        {error && <p className="form-error">{error}</p>}
      </div>
    </div>
  );
}

/* ================= PROJECT FORM ================= */
export function ProjectForm() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEdit = Boolean(projectId);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "idea",
    supportNeeded: "None",
    tags: "",
    repoUrl: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");

    if (isEdit) {
      getProject(projectId).then((res) => {
        const p = res.data;
        setForm({
          title: p.title,
          description: p.description,
          status: p.status,
          supportNeeded: p.supportNeeded || "None",
          tags: p.tags?.join(", ") || "",
          repoUrl: p.repoUrl || "",
          notes: p.notes || "",
        });
      });
    }
  }, [projectId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
    };

    try {
      if (isEdit) {
        await updateProject(projectId, payload);
        navigate(`/projects/${projectId}`);
      } else {
        const res = await createProject(payload);
        navigate(`/projects/${res.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error saving project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="form-box">
        <h2>{isEdit ? "Edit Project" : "New Project"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <button className="btn btn-green" disabled={loading}>
            {loading ? "Saving..." : "Submit"}
          </button>
        </form>

        {error && <p className="form-error">{error}</p>}
      </div>
    </div>
  );
}

/* ================= CELEBRATION ================= */
export function CelebrationPage() {
  return (
    <div className="page">
      <CelebrationWall />
    </div>
  );
}