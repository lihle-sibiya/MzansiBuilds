"use strict";

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

connectDB(); // Connect to the database

const app = express(); //create server

//Attach the cors and express.json() middleware that express will use
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to Mzansi Builds API");
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 5000; // Define the port to listen on

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});