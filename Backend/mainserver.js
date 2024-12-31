const express = require("express"); 
const mongoose = require("mongoose"); 
const bodyParser = require("body-parser"); 
const multer = require("multer"); 
const cors = require("cors"); 
const nodemailer = require("nodemailer"); 
require("dotenv").config(); 
const path = require('path'); 
const { MongoClient } = require("mongodb"); 
const { spawn } = require("child_process"); // To run Python scripts
// Importing the exported app from image.js 
const { app: imageApp } = require('./image');
// Server.js
const { mongodb: mongoDB } = require('./Server');

// Run the server on port 8080 
const PORT = 8080; 
imageApp.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// Run the Flask API server
const runPythonServer = () => {
    const pythonProcess = spawn('python', ['api_server.py']); // Ensure python is available in your PATH
    
    pythonProcess.stdout.on('data', (data) => {
        console.log(`Python Server Output: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Server Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
    });
};

// Start the Python Flask API Server
runPythonServer();

