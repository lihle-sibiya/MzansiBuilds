//  Root component - sets up Auth context, Router and all routes

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./services/AuthContext";

import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ProjectDetails from "./pages/ProjectDetails";

// Named exports
import {
  Login,
  Signup,
  ProjectForm,
  CelebrationPage
} from "./pages/ExtraPages";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/profile/:userId" element={<Profile />} />

          <Route path="/projects/new" element={<ProjectForm />} />
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
          <Route path="/projects/:projectId/edit" element={<ProjectForm />} />

          <Route path="/celebration" element={<CelebrationPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}