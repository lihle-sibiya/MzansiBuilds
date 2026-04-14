import { useEffect, useState } from "react";
import { getProjects } from "../services/api";
import ProjectCard from "../components/ProjectCard";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getProjects();

        console.log("API RESPONSE:", res.data); 

      
        const data = res.data;

        if (Array.isArray(data)) {
          setProjects(data);
        } else if (Array.isArray(data.projects)) {
          setProjects(data.projects);
        } else {
          setProjects([]); // fallback
        }

      } catch (err) {
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
      </div>
    );
  }

  if (error) return <p className="empty">{error}</p>;

  return (
    <div className="page">
      <h1>🔥 Build in Public Feed</h1>

      {projects.length === 0 ? (
        <p className="empty">No projects yet</p>
      ) : (
        <div className="grid">
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}