"use strict";

const router = require("express").Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");
const {validateSignup} = require("../middleware/validationMiddleware");

//Auth routes (public)
router.post("/signup", validateSignup, userController.signup);
router.post("/login", userController.login);


//User routes (auth required)
router.get("/:userId/projects", verifyToken, userController.getUserProjects);
router.get("/:userId", verifyToken, userController.getUser);
router.put("/:userId", verifyToken, userController.updateUser);
router.delete("/:userId", verifyToken, userController.deleteAccount);


module.exports = router;