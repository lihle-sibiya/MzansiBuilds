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

// GET /projects/:projectId — get a single project
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
      return res.status(404).json({
        message: "Project not found or you do not have permission to edit it."
      });
    }
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during project update" });
  }
};

// POST /projects/:projectId/milestones — log a milestone
exports.addMilestone = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      developer: req.user._id // only owner can add milestones
    });
    if (!project) {
      return res.status(404).json({
        message: "Project not found or you do not have permission to edit it."
      });
    }
    project.milestones.push({
      description: req.body.description,
      achievedAt: new Date()
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during milestone addition" });
  }
};

// POST /projects/:projectId/comments
exports.addComment = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.comments.push({
      text: req.body.text,
      developer: req.user._id,
      createdAt: new Date()
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during comment addition" });
  }
};

// POST /projects/:projectId/collaborate — raise hand for collaboration
exports.requestCollaboration = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Prevent owner from requesting their own project
    if (project.developer.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot collaborate on your own project"
      });
    }

    // Prevent duplicate requests
    if (project.collaborators.includes(req.user._id)) {
      return res.status(400).json({
        message: "You have already requested to collaborate"
      });
    }

    project.collaborators.push(req.user._id);
    await project.save();

    res.json({
      message: "Collaboration request sent 🤝",
      project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error during collaboration request"
    });
  }
};

// PUT /projects/:projectId/complete — mark project as completed
exports.completeProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      developer: req.user._id
    }); // only owner can complete

    if (!project) {
      return res.status(404).json({
        message: "Project not found or you do not have permission to edit it."
      });
    }
    project.status = "completed";
    project.completedAt = new Date();
    await project.save();
    res.json({
      message: "Project completed! You are on the Celebration Wall 🎉",
      project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during project completion" });
  }
};

// GET /projects/celebration — Celebration Wall (MUST be before /:projectId in routes)
exports.getCelebrationWall = async (req, res) => {
  try {
    const completedProjects = await Project.find({ status: "completed" })
      .populate("developer", "name email")
      .sort({ completedAt: -1 });
    res.json(completedProjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching Celebration Wall" });
  }
};

// DELETE /projects/:projectId — delete a project
exports.deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findOneAndDelete({
      _id: req.params.projectId,
      developer: req.user._id // only owner can delete
    });
    if (!deleted) {
      return res.status(404).json({
        message: "Project not found or you do not have permission to delete it."
      });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during project deletion" });
  }
};
