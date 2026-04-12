const mongoose = require('mongoose');

async function connectToDB() {
    try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mzansibuilds');
    console.log('Connected to MongoDB successfully');
} catch (error) { 
     console.log('MongoDB connection failed:', error.message);  

}
 };  

module.exports = connectToDB;