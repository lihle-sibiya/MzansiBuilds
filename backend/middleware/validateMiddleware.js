"use strict";

const User = require("../models/User");

//Validate signup fields
const validateSignup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Please provide email, password and name." });
    }

    //Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid email address." });
    }

    //Check password strength
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
    }

    // Check if user already exists
    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A user with this email already exists." });
    }
    //use the normalized email for consistency before it goes to the controller/DB
    req.body.email = normalizedEmail;

    next();
  } catch (error) {
    console.error("Error validating signup:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error during signup validation." });
  }
};
//Validate project fields
const validateProject = (req, res, next) => {
  const { title, description, status, supportNeeded } = req.body;
  if (!title?.trim() || !description?.trim() || !status || !supportNeeded?.trim()) {
    return res
      .status(400)
      .json({
        message:
          "Missing required fields. Title, description, status, and supportNeeded are required."
      });
  }

  //Check that the status is one of the allowed values
  const allowedStatus = [
    "idea",
    "planning",
    "building",
    "testing",
    "launching",
    "completed"
  ];
  if (!allowedStatus.includes(status.toLowerCase())) {
    return res
      .status(400)
      .json({
        message: `Invalid status. Allowed values are: ${allowedStatus.join(", ")}`
      });
  }

  //force the status to lowercase before it goes to the controller/DB
  req.body.status = status.toLowerCase();

  next();
};

module.exports = { validateSignup, validateProject };
