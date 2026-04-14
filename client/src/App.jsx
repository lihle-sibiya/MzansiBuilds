// // App.jsx
// // Root component — sets up Auth context, Router, and all routes

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./services/AuthContext";

// // Layout
// import Navbar from "./components/Navbar";

// // Pages
// import Home           from "./pages/Home";
// import Profile        from "./pages/Profile";
// import ProjectDetails from "./pages/ProjectDetails";
// import { Login, Signup, ProjectForm, CelebrationPage } from "./pages/ExtraPages";
// import { Login, Signup, ProjectForm, CelebrationPage } from "./pages/Home";

// import "./index.css";

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Navbar />
//         <Routes>
//           <Route path="/"                        element={<Home />} />
//           <Route path="/login"                   element={<Login />} />
//           <Route path="/signup"                  element={<Signup />} />
//           <Route path="/celebration"             element={<CelebrationPage />} />
//           <Route path="/profile/:userId"         element={<Profile />} />
//           <Route path="/projects/new"            element={<ProjectForm />} />
//           <Route path="/projects/:projectId"     element={<ProjectDetails />} />
//           <Route path="/projects/:projectId/edit" element={<ProjectForm />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }


// App.jsx
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./services/AuthContext";

// import Navbar from "./components/Navbar";

// // Pages (default exports)
// import Home from "./pages/Home";
// import Profile from "./pages/Profile";
// import ProjectDetails from "./pages/ProjectDetails";

// // Named exports from ExtraPages
// import {
//   Login,
//   Signup,
//   ProjectForm,
//   CelebrationPage
// } from "./pages/ExtraPages";

// import "./index.css";

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Navbar />

//         <Routes>
//           {/* Home route (VERY IMPORTANT) */}
//           <Route path="/" element={<Home />} />

//           {/* Auth */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />

//           {/* Profile */}
//           <Route path="/profile/:userId" element={<Profile />} />

//           {/* Projects */}
//           <Route path="/projects/new" element={<ProjectForm />} />
//           <Route path="/projects/:projectId" element={<ProjectDetails />} />
//           <Route path="/projects/:projectId/edit" element={<ProjectForm />} />

//           {/* Celebration */}
//           <Route path="/celebration" element={<CelebrationPage />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./services/AuthContext";

import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ProjectDetails from "./pages/ProjectDetails";

// IMPORTANT: named exports
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