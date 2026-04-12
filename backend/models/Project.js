"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
      title: String,
      body: String,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      dateStarted: {
        type: Date,
        default: Date.now
      },

      image: String
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;