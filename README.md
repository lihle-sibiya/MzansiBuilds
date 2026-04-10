"# MzansiBuilds" 

## 1. Project Overview

MzansiBuilds is a full-stack developer community platform where South African developers can build in public. 

Users can create project entries, share progress through milestones, collaborate with other developers and showcase completed work on a public Celebration Wall.

The platform is built using a React frontend that communicates with a Node.js and Express REST API, with MongoDB Atlas as the database. The system follows an MVC (Model-View-Controller) architectural pattern to ensure separation of concerns, scalability and maintainability.

---


## 2. Requirements Coverage

Every user journey requirement from the specification is implemented:

| # | Specification Requirement | Implementation |
|---|--------------------------|---------------|
| 1 | Developer can create and manage own account | JWT-authenticated signup/login with profile management |
| 2 | Create a new project entry with stage and support required | `POST /api/projects` with stage enum and `supportNeeded` field |
| 3 | Live feed of what others are building with comments and collaboration requests | `GET /api/projects` feed with embedded comments and collaboration request flag |
| 4 | Continuously update project progress with milestones | `POST /api/projects/:id/milestones` with visual timeline on profile |
| 5 | Completed projects added to Celebration Wall | `PATCH /api/projects/:id/complete` -> dedicated wall page |