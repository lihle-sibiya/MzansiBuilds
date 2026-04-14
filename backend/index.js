"use strict";

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

const User = require("./models/User");
const Project = require("./models/Project");

dotenv.config(); // Load environment variables from .env file

connectDB(); // Connect to the database

const app = express(); //create server

//Attach the cors and express.json() middleware that express will use
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());


const path = require("path");

//Homepage
app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));


//Dashboard route 
app.get("/api/dashboard", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const completedProjects = await Project.countDocuments({ status: "completed" });
    const activeProjects = await Project.countDocuments({ status: { $ne: "completed" } });

    res.json({
      totalUsers,
      totalProjects,
      completedProjects,
      activeProjects,
      status: "online",
      message: "API Healthy"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard error" });
  }
});


// API routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));


// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on our end!' });
});



const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});