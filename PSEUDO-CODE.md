# MzansiBuilds Pseudo-Code

This is my plan for how I will build the MzansiBuilds platform.  
I wrote this to understand the project structure, models and routes before coding.

---

## 1. Models

### User
- id
- name
- email
- password
- projects → list of project IDs

### Project
- id
- ownerId: user who created it
- title
- description
- stage: idea, development, testing, completed
- supportNeeded: what help I need
- milestones: list of updates I achieve
- comments: from other developers
- collaborators: users who want to help

---

## 2. Routes

### User Routes
- `POST /users/register` : create a new account
- `POST /users/login` : login
- `GET /users/:id` : get user profile

### Project Routes
- `POST /projects` : create a new project
- `GET /projects` : see all projects (live feed)
- `GET /projects/:id` : see a single project
- `PATCH /projects/:id` : update milestones or stage
- `POST /projects/:id/comments` : add comment or collaboration request

### Celebration Wall
- `GET /celebration` : show all completed projects

---

## 3. Notes

- I will separate the project like this:
  - `models/` : database structure (User.js, Project.js)
  - `routes/` : all routes (users.js, projects.js)
  - `controllers/` : logic for handling requests
  - `middleware/` : authentication functions
  - `utils/` : helper functions if needed
- Frontend will be in **React** using MVC pattern:
  - Model : state and API calls
  - View : JSX components
  - Controller : functions that update state / call backend
- Styling will use **CSS** to get green, white, black theme

---

### Why I wrote this
- Helps me understand what to build first
- Makes coding faster and cleaner
- Easy to explain planning or project structure
