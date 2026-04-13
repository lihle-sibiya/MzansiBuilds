"use strict";

const router = require("express").Router();
const projectController = require("../controllers/projectController");
const{verifyToken, isProjectOwner} = require("../middleware/authMiddleware");
const {validateProject} = require("../middleware/validateMiddleware");

//Celebration wall
router.get("/celebration", projectController.getCelebrationWall);

//Public
router.get("/", projectController.getProjects);
router.get("/:projectId", projectController.getProject);

//Auth required
router.post("/", verifyToken, validateProject, projectController.createProject);

//Auth required + ownership required
router.put("/:projectId", verifyToken, isProjectOwner, projectController.updateProject);
router.delete("/:projectId", verifyToken, isProjectOwner, projectController.deleteProject);
router.put("/:projectId/complete", verifyToken, isProjectOwner, projectController.completeProject);
router.post("/:projectId/milestones", verifyToken, isProjectOwner, projectController.addMilestone);

//Auth required (any logged-in user)
router.post("/:projectId/comments", verifyToken, projectController.addComment);
router.post("/:projectId/collaborate", verifyToken, projectController.requestCollaboration);

module.exports = router;