"# MzansiBuilds" 

## 1. Project Overview

MzansiBuilds is a full-stack developer community platform where South African developers can build in public. 

Users can create project entries, share progress through milestones, collaborate with other developers and showcase completed work on a public Celebration Wall.

-Register and authenticate securely
- Create and manage development projects
- Track project progress using defined stages
- View projects created by other developer

The platform is built using a React frontend that communicates with a Node.js and Express REST API, with MongoDB Atlas as the database. The system follows an MVC (Model-View-Controller) architectural pattern to ensure separation of concerns, scalability and maintainability.

---


## 2. Features
- User registration and login (JWT authentication)
- Create, update, and delete projects
- Project status tracking (idea → completed)
- Protected routes with authorization
- Input validation middleware for secure data handling

---

## 3. Tech Stack
Layer	            Technology
Frontend	        React
Backend	            Node.js + Express
Database	        MongoDB + Mongoose
Authentication	    JSON Web Tokens (JWT)
Password Hashing	bcryptjs
Hosting	Render (API), Netlif (Frontend)

---

## 4. Architecture - MVC Pattern

MzansiBuilds follows MVC across both the backend and frontend:


- Models: Define database structure (User, Project)
- Controllers: Handle business logic and API responses
- Routes: Define API endpoints
- Middleware: Handle authentication, authorization, and validation


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
        ├── authMiddleware.js      # JWT protect middleware           
│   │   └── validateMiddleware.js               
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


---


 ## 6. Security & Best Practices

-  **Data Normalization:** All project statuses are normalized to lowercase in the backend to prevent case-sensitivity bugs. UI presentation is handled via CSS `text-transform: capitalize`.
-  **Validation Middleware:** Implemented custom Express middleware to validate request bodies (Email regex, password length, and enum checks) before reaching the database layer.
- **Secure Password Storage:** Using `bcryptjs` for one-way salting and hashing of user passwords.
- **Stateless Auth:** JWT-based authentication ensures secure access to protected routes like project management and milestone updates.

---

 ## 7. Authentication
- JWT-based authentication system
- Token must be included in requests:

Authorization: Bearer

- Protected routes:
- Create project
- Update project
- Delete project

---

 ## 8. Running Locally
- Backend
  - cd backend
  - npm install
  - npm run dev

- Frontend
  - cd client
  - npm install
  - npm start

- Create a .env file in the backend:

MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret

---

 ## 9. API Endpoints
- Auth
- POST /api/users/register
- POST /api/users/login
- Projects
- GET /api/projects
- POST /api/projects (protected)
- PUT /api/projects/ (protected)
- DELETE /api/projects/ (protected)

---

 ## 10. Summary

MzansiBuilds demonstrates a full-stack MERN application with:

- Structured backend architecture (MVC)
- Secure authentication and authorization
- Clean API design
- Scalable and maintainable code practices

---

 ## 10. Live Demo
- Backend and frontend are currently not deployed yet.
- Deployment will be added before final submission.
