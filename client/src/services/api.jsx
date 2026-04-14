// All HTTP calls to the Express backend using Axios

import axios from "axios";

// Create one axios instance for the whole app
const api = axios.create({
  baseURL: "/api",                            
  headers: { "Content-Type": "application/json" },
});

// Before every request, attach the JWT token if the user is logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// USER ROUTES (matches userRoutes.js) 
export const signup        = (data)           => api.post("/users/signup", data);
export const login         = (data)           => api.post("/users/login", data);
export const getUser       = (userId)         => api.get(`/users/${userId}`);
export const updateUser    = (userId, data)   => api.put(`/users/${userId}`, data);
export const deleteAccount = (userId)         => api.delete(`/users/${userId}`);
export const getUserProjects = (userId)       => api.get(`/users/${userId}/projects`);

// PROJECT ROUTES (matches projectRoutes.js) 
export const getProjects    = ()                    => api.get("/projects");
export const getProject     = (id)                  => api.get(`/projects/${id}`);
export const createProject  = (data)                => api.post("/projects", data);
export const updateProject  = (id, data)            => api.put(`/projects/${id}`, data);
export const deleteProject  = (id)                  => api.delete(`/projects/${id}`);
export const completeProject = (id)                 => api.put(`/projects/${id}/complete`);
export const addMilestone   = (id, data)            => api.post(`/projects/${id}/milestones`, data);
export const addComment     = (id, data)            => api.post(`/projects/${id}/comments`, data);
export const requestCollab  = (id)                  => api.post(`/projects/${id}/collaborate`);
export const getCelebration = ()                    => api.get("/projects/celebration");

export default api;