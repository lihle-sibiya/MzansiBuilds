"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* ============== MILESTONE =============== */
const MilestoneSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a milestone title"],
      trim: true
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxLength: [500, "Description cannot exceed 500 characters"]
    },

    dueDate: Date,

    completed: {
      type: Boolean,
      default: false
    },

    completedAt: Date,

    celebrationTitle: {
      type: String,
      default: "Milestone reached!"
    },

    celebrationMessage: {
      type: String,
      default: ""
    }
  },

  { timestamps: true }
);

/* ================= COMMENT ======================*/

const CommentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    username: {
      type: String,
      trim: true
    },

    body: {
      type: String,
      required: [true, "Please provide a comment"],
      trim: true,
      maxLength: [300, "Comment cannot exceed 300 characters"]
    },

    isCollaborationRequest: {
      type: Boolean,
      default: false
    }
  },

  {
    timestamps: true
  }
);

/* ==================== PROJECT ============================*/
const ProjectSchema = new Schema(
  {
    developer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Project must have a developer"]
    },

    //Project name
    title: {
      type: String,
      required: [true, "Please provide a project title"],
      trim: true
    },

    description: {
      type: String,
      required: [true, "Please provide a project description"],
      trim: true,
      maxLength: [1000, "Description cannot exceed 1000 characters"]
    },

    dateStarted: {
      type: Date,
      default: Date.now
    },

    status: {
      type: String,
      enum: {
        values: [
          "idea",
          "planning",
          "building",
          "testing",
          "launching",
          "completed"
        ],
        message: "{VALUE} is not a valid project status"
      },
      default: "idea"
    },

    //Optional completion tracking
    completedAt: Date,

    notes: {
      type: String,
      default: "",
      trim: true,
      maxLength: [500, "Notes cannot exceed 500 characters"]
    },

    supportNeeded: {
      type: String,
      enum: {
        values: [
          "None",
          "Mentorship",
          "Collaborator",
          "Beta Testers",
          "Feedback"
        ],
        message: "{VALUE} is not a valid support type"
      },

      default: "None"
    },

    // Technology or topic tags e.g. ['React', 'FinTech', 'Open Source']
    tags: 
      {
        type: [String],
        default: []
      },

    // Optional link to a GitHub repo or live demo
    repoUrl: {
      type: String,
      trim: true,
      match: [
        /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\/)?$/,
        "Please provide a valid GitHub repository URL"
      ],
      default: ""
    },

    // Optional project cover image — stores a URL to a hosted image
    imageUrl: {
      type: String,
      default: ""
    },

    milestones: [MilestoneSchema],

    comments: [CommentSchema],

    collaborators: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },

  {
    timestamps: true
  }
);

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
