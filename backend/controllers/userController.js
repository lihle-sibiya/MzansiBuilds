"use strict";

const User = require("../models/User");         

//GET /users/:userId
exports.getUser = async (req, res) => {
    try{
        const user = await User.findById(req.params.userId).select("-password -__v");
        
        if(!user)
            return res.status(404).json({ message: "User not found" });
        
        res.json(user);
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error" });      
    }
};


// PUT /users/:userId
exports.updateUser = async (req, res) => {
    // Prevent users from updating other accounts
  if (req.params.userId !== req.user.id.toString()) {
    return res.status(403).json({ message: "Access denied" });
  }
  // Prevent password updates here (handle separately)
  if (req.body.password) {
    return res.status(400).json({ message: "Password updates not allowed here" });
  }

  try{
    const updated = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true, runValidators: true }).select("-password -__v");
   
    res.json(updated);
  }catch(err){
    console.error(err);
    res.status(400).json({ message: "Server error" });      
  }

};

//DELETE /users/:userId

exports.deleteAccount = async (req, res) => {
     // Prevent users from deleting other accounts
  if (req.params.userId !== req.user.id.toString()) {
    return res.status(403).json({ message: "Access denied" });
  }     
  try{
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch(err){
    console.error(err);
    res.status(400).json({ message: "Server error" });      
  }
};

// GET /users/:userId/projects
exports.getUserProjects = async (req, res) => { 
    try{
        const user = await User.findById(req.params.userId)
        .select("-password -__v").populate("projects"); // assumes projects ref on User model
        if(!user)            
            {return res.status(404).json({ message: "User not found" });
    }
        res.json(user.projects);  // return only projects
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error" });      
    }
};
