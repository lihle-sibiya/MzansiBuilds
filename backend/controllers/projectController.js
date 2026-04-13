"use strict";

const Project = require("../models/Project");

// POST /projects — create a new project
exports.createProject = async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      developer: req.user._id // pull a logged-in user
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Server error" });
  }
};

// GET /projects — live feed, all projects, newest first
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("developer", "name email") //show who is buidling
      .sort({ createdAt: -1 }); //newest first == live feed
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /projects/:id — get a single project by ID
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate("developer", "name email")
      .populate("comments.developer", "name email"); //show who is building
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /projects/:projectId - update project details or stage
exports.updateProject = async (req, res) => {
  try {
    const updated = await Project.findOneAndUpdate(
      { _id: req.params.projectId, developer: req.user._id }, // double check ownership
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res
        .status(404)
        .json({
          message:
            "Project not found or or you do not have permission to edit it."
        });
    }
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during project update" });
  }


};
