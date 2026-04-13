"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator").default;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please provide your fullname"],
        trim: true
    },


    email: {
        type: String,
        required: [true, "Please provide your email address"],
        unique: true,
        trim: true, //removes extra spaces
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"]

    },


    password: {
        type: String,
        required: [true, "Please provide Password"],
        minLength: [8, "Password must be at least 8 characters long"]
    },


    bio: {
        type: String,
        default: "",
        maxLength: [300, "Bio cannot exceed 300 characters"]
    },


    projects: [{
        type: Schema.Types.ObjectId,
        ref: "Project",
    }],
}, 
{
timestamps: true

});



UserSchema.plugin(uniqueValidator, { message: "{PATH} already exists" });

UserSchema.pre("save", async function () {
    // Only hash the password if it has been modified or is new
   if (!this.isModified("password")) return;

  try {
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
  } catch (err) {
    console.error("Password hashing error:", err);
  }
});


UserSchema.methods.comparePassword = function (enteredPassword) {
    // "this.password" is the hashed password in the Database
    return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;