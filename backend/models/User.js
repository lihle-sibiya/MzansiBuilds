"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please provide Username"],
    unique: true

  },
  password: {
    type: String,
    required: [true, "Please provide Password"]
  }
});

UserSchema.plugin(uniqueValidator, { message: "Username already exists" });

UserSchema.pre("save", function (next) {
    if(!this.isModified("password"))
    { 
        return next();
    }
    bcrypt.hash(this.password, 10)
    .then(hash =>{
        this.password = hash
        next()
    })
    .catch(error => console.log(error))
})


const User = mongoose.model("User", UserSchema);

module.exports = User;