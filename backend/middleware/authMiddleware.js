"use strict";

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Project = require("../models/Project");



const verifyToken = async(req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    
    if (!token) {
      return res.status(401).json({ message: "No token provided!" });
    }

    try
    {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        //If token is valid
        req.user = user;
        next();
    } catch (error){
        console.error("Error verifying token:", error.message);
        return res.status(401).json({ message: "Unauthorized! Invalid or expired token." });
    }
};

const isProjectOwner = async(req, res, next) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found!" });
        }

    if (project.owner.toString() !== req.userId._id.toString()) {
        return res.status(403).json({ message: "Forbidden! You can only modify your own projects.",

         });  
    };

    req.project = project;
    next();
    } catch (error) {
        console.error("isProjectOwner error:", error.message);
        return res.status(500).json({ message: "Internal server error while checking project ownership." });
    }
};

    module.exports = {verifyToken, isProjectOwner};
