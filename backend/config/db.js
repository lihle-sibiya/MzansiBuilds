// const mongoose = require('mongoose');

// async function connectToDB() {
//     try {
//     await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mzansibuilds');
//     console.log('Connected to MongoDB successfully');
// } catch (error) { 
//      console.log('MongoDB connection failed:', error.message);  

// }
//  };  

// module.exports = connectToDB;


const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas connected 🚀");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;