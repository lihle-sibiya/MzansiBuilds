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
| 5 | Completed projects added to Celebration Wall | `PATCH /api/projects/:id/complete` → dedicated wall page |

---


## 3. Tech Stack

| Layer | Technology | Reason |
|------|-----------|--------|
| Frontend | React 18 | Component-based UI, industry standard |
| API Calls | Axios | Clean HTTP client with support for interceptors (useful for JWT handling) |
| Backend | Node.js + Express | Fast, lightweight REST API |
| Database | MongoDB + Mongoose | Flexible document model suits project and milestone nesting |
| Authentication | JSON Web Tokens (JWT) | Stateless, scalable authentication |
| Password Hashing | bcryptjs | Industry-standard secure password storage |
| Testing | Jest + Supertest | Unit and integration testing |
| CI/CD | GitHub Actions | Automated testing and deployment pipeline |
| Hosting (API) | Render | Free-tier Node.js hosting |
| Hosting (Frontend) | Netlify | Fast static site hosting for React apps |

---

## 4. Architecture - MVC Pattern

MzansiBuilds follows MVC across both the backend and frontend:


┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│                                                                 │
│   VIEW (components/)          CONTROLLER (controllers/)         │
│   ┌──────────────────┐        ┌──────────────────────────────┐  │
│   │ ProjectFeed.js   │        │ projectController.js         │  │
│   │ ProjectCard.js   │◄──────►│ (Axios API calls to backend) │  │
│   │ CelebrationWall  │        └──────────────────────────────┘  │
│   │ CommentForm.js   │                    │                      │
│   └──────────────────┘                    │ HTTP (Axios)         │
└───────────────────────────────────────────┼─────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND (Express)                        │
│                                                                 │
│  ROUTES            CONTROLLER              MODEL                │
│  ┌──────────┐     ┌─────────────────┐    ┌──────────────────┐  │
│  │ users.js │────►│ userController  │───►│   User.js        │  │
│  │          │     │ .js             │    │  (Mongoose)      │  │
│  └──────────┘     └─────────────────┘    └──────────────────┘  │
│  ┌──────────┐     ┌─────────────────┐    ┌──────────────────┐  │
│  │projects  │────►│ projectController│──►│   Project.js     │  │
│  │ .js      │     │ .js             │    │  (Mongoose)      │  │
│  └──────────┘     └─────────────────┘    └──────────────────┘  │
│                                                    │            │
└────────────────────────────────────────────────────┼────────────┘
                                                     │
                                                     ▼
                                          ┌──────────────────┐
                                          │   MongoDB Atlas  │
                                          │   (Cloud DB)     │
                                          └──────────────────┘

Data Flow:

React component triggers an action → frontend controller makes Axios call → Express route receives request → middleware verifies JWT → controller processes logic → Mongoose interacts with MongoDB → JSON response returns → UI updates.

---

## 5. Project Structure

```text
MzansiBuilds/
│
├── backend/                        # Backend folder
│   ├── index.js                    # Server entry point
│   ├── package.json
│   ├── .env.example                # Environment variable template
│   │
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   │
│   ├── models/                     # Database schemas (Models)
│   │   ├── User.js                 # User schema + bcrypt hook
│   │   └── Project.js              # Project schema with embedded milestones & comments
│   │
│   ├── controllers/                # Business logic (Controllers)
│   │   ├── userController.js       # register, login, getProfile, getMe
│   │   └── projectController.js    # create, read, update, milestone, comment, complete
│   │
│   ├── routes/                     # API endpoints
│   │   ├── users.js                # /api/users/*
│   │   └── projects.js             # /api/projects/*
│   │
│   ├── middleware/
│   │   └── auth.js                 # JWT protect middleware
│   │
│   └── utils/
│       └── helpers.js              # generateToken() helper
│
├── client/                         # Frontend folder
│   ├── package.json
│   ├── .env.example
│   │
│   ├── public/
│   │   └── index.html              # HTML entry point
│   │
│   └── src/
│       ├── App.js                  # Root component, routing, AuthContext
│       ├── App.css                 # Global styles (green/white/black theme)
│       ├── index.js                # React DOM entry point
│       │
│       ├── components/             # React Components (View)
│       │   ├── ProjectFeed.js
│       │   ├── ProjectCard.js
│       │   ├── CelebrationWall.js
│       │   └── CommentForm.js
│       │
│       ├── pages/                  # Pages / screens
│       │   ├── Home.js
│       │   ├── Profile.js
│       │   └── ProjectDetail.js
│       │
│       └── controllers/            # Frontend controller functions
│           └── projectController.js
│
├── tests/
│   └── app.test.js                 # Jest test suite (30+ tests)
│
├── docs/
│   ├── UML.md                      # Diagrams
│   └── SECURITY.md                 # Security documentation
│
├── .github/
│   └── workflows/
│       └── ci.yml                  # CI/CD pipeline
│
├── .gitignore
├── CHANGELOG.md
└── README.md