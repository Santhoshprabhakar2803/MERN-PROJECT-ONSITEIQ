// npm install express nodemailer cors body-parser
// npm install jsonwebtoken
// npm install dotenv
// npm install pdfkit

// Import dependencies
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const nodemailer = require("nodemailer");
const path = require('path');
const { Collection } = require("mongoose");
// const multer = require("multer");
require("dotenv").config();
const { ObjectId } = require('mongodb');
const PDFDocument = require("pdfkit");
const fs = require('fs');

// Initialize the app
const app = express();
const PORT = 5000;
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Configuration
const mongoUri = "mongodb+srv://saikrishnan209:Sairam_22@cluster0.bvxx4.mongodb.net/";
const client = new MongoClient(mongoUri);
const dbName = 'OnsiteIQ';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Temporary store for OTPs
let otpStore = {};

// Function to connect to MongoDB
async function connectToDatabase() {
  try {
      await client.connect(); // Connect the client
      console.log('Connected to MongoDB');
  } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      process.exit(1); // Exit if connection fails
  }
}
// Connect to the database when the server starts
connectToDatabase();
// Log environment variables for debugging
console.log("EMAIL:", process.env.EMAIL);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);

      // Endpoint to send OTP
      app.post("/send-otp", async (req, res) => {
        const { email } = req.body;

        if (!email) {
          return res.status(400).json({ success: false, message: "Email is required." });
        }

        // Generate a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP in memory (expires after 5 minutes)
        otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // 5 minutes expiration

        // Configure the transporter
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        // Email content
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Your OTP Code",
          text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
        };

        try {
          // Send email
          await transporter.sendMail(mailOptions);
          res.json({ success: true, message: "OTP sent successfully." });
        } catch (error) {
          console.error("Error sending OTP:", error);
          res.status(500).json({ success: false, message: "Failed to send OTP." });
        }
      });

      // Endpoint to verify OTP
      app.post("/verify-otp", (req, res) => {
        const { email, otp } = req.body;

        if (!email || !otp) {
          return res.status(400).json({ success: false, message: "Email and OTP are required." });
        }

        const storedOtpData = otpStore[email];

        // Validate OTP
        if (!storedOtpData) {
          return res.status(400).json({ success: false, message: "OTP not found. Please request a new OTP." });
        }

        const { otp: storedOtp, expiresAt } = storedOtpData;

        if (Date.now() > expiresAt) {
          delete otpStore[email]; // Remove expired OTP
          return res.status(400).json({ success: false, message: "OTP has expired. Please request a new OTP." });
        }

        if (storedOtp === otp) {
          delete otpStore[email]; // Remove OTP after successful verification
          return res.json({ success: true, message: "OTP verified successfully." });
        }

        res.status(400).json({ success: false, message: "Invalid OTP." });
      });


      // Extracting emails from Registration
      app.get("/get-registered-emails", async (req, res) => {
        try {
          // Connect to the database
          const db = client.db(dbName);
          const collection = db.collection('Registration-Attempt');
          
          // Find all registration attempts and extract email field
          const attempts = await collection.find({}).project({ email: 1, _id: 0 }).toArray(); // Extract only the email field
      
          if (attempts.length > 0) {
            // If emails are found, send them back as a response
            res.json({ success: true, emails: attempts });
          } else {
            // If no attempts are found
            res.json({ success: false, message: "No emails found." });
          }
        } catch (error) {
          console.error("Error retrieving emails:", error);
          res.status(500).json({ success: false, message: "Error retrieving emails." });
        }
      });

      // fetching Login Email and password
      app.get("/get-login-details", async (req, res) => {
        try {
          // Connect to the database
          const db = client.db(dbName);
          const collection = db.collection('LoginWorkersDetails');
          
          // Find all login details and extract orgEmail and password fields
          const loginDetails = await collection.find({}).project({ orgEmail: 1, password: 1, _id: 0 }).toArray(); // Extract orgEmail and password fields
      
          if (loginDetails.length > 0) {
            // If login details are found, send them back as a response
            res.json({ success: true, loginDetails });
          } else {
            // If no login details are found
            res.json({ success: false, message: "No login details found." });
          }
        } catch (error) {
          console.error("Error retrieving login details:", error);
          res.status(500).json({ success: false, message: "Error retrieving login details." });
        }
      });
      
      
      // New API to store registration attempt
      // Store Registration Attempt Route
        app.post('/store-registration-attempt', async (req, res) => {
          const { email } = req.body;
          const date = new Date();
          const attemptDate = date.toISOString().split('T')[0]; // Get the date part
          const attemptTime = date.toISOString().split('T')[1]; // Get the time part

          try {
            // Connect to the database
            const db = client.db(dbName);
            const collection = db.collection('Registration-Attempt');

            // Insert the registration attempt with initial status as null
            const result = await collection.insertOne({
              email,
              attemptDate,
              attemptTime,
              createdAt: new Date(),
              status: null, // Initially, status is null
            });
            res.json({ success: true, message: 'Registration attempt recorded successfully!' });
          } catch (error) {
            console.error('Error recording registration attempt:', error);
            res.status(500).json({ success: false, message: 'Error recording registration attempt' });
          }
        });

        // Get Registration Attempts (Only when status is null)
        app.get('/get-registration-attempts', async (req, res) => {
          try {
            // Connect to the database
            const db = client.db(dbName); // Replace with your database name
            const collection = db.collection('Registration-Attempt');

            // Fetch data only where status is null
            const attempts = await collection.find({ status: null }).toArray();

            res.json({ success: true, attempts });
          } catch (error) {
            console.error('Error fetching registration attempts:', error);
            res.status(500).json({ success: false, message: 'Error fetching registration attempts' });
          }
        });

        // Update Registration Status (e.g., Approve or Deny)
      app.post("/update-registration-status", async (req, res) => {
          const { email, status } = req.body; // Status can be 'approved' or 'denied'

          if (!email || !status) {
              return res.status(400).json({ success: false, message: "Email and status are required." });
          }

          try {
              // Connect to the database
              const db = client.db(dbName);
              const collection = db.collection("Registration-Attempt");

              // Only update if status is still null (pending)
              const result = await collection.updateOne(
                  { email, status: null }, // Only update if status is still null
                  { $set: { status } }
              );

              if (result.modifiedCount > 0) {
                  // If the status is updated successfully, send email if status is "denied"
                  if (status === "denied") {
                      const transporter = nodemailer.createTransport({
                          service: "gmail",
                          auth: {
                              user: process.env.EMAIL, // Your email address
                              pass: process.env.EMAIL_PASSWORD, // Your email password
                          },
                      });

                      const emailContent = `
                          <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                              <h2 style="color: #d9534f;">Registration Denied</h2>
                              <p>Dear User,</p>
                              <p>We regret to inform you that your registration has been denied by our team. If you believe this is a mistake or need further assistance, please feel free to contact our support team.</p>
                              <p>Best regards,<br>Your Team</p>
                          </div>
                      `;

                      const mailOptions = {
                          from: process.env.EMAIL,
                          to: email,
                          subject: "Registration Denied",
                          html: emailContent,
                      };

                      await transporter.sendMail(mailOptions);
                  }

                  res.json({ success: true, message: `Registration ${status} successfully!` });
              } else {
                  res.json({ success: false, message: 'No pending registration found for this email.' });
              }
          } catch (error) {
              console.error("Error updating registration status:", error);
              res.status(500).json({ success: false, message: "Error updating registration status" });
          }
      });

      
      
  // Register Validation and adding to login collection based on status
  app.post('/allow-registration', async (req, res) => {
    const { email } = req.body;
  
    try {
      // Connect to the database
      const db = client.db(dbName);
      const loginCollection = db.collection('LoginWorkersDetails');
      const attemptCollection = db.collection('Registration-Attempt');  // Added the Registration-Attempt collection
  
      // Generate organization email and password
      const organization = "onsiteiq.org.in";
      const org = 'site';
      const emailPrefix = email.split('@')[0]; // Extract prefix from user's email
      const orgEmail = `${emailPrefix}@${organization}`;
      const password = `${email.split('@')[0].substring(0, 4)}${org}`.replace(/[^a-zA-Z0-9]/g, "") + Math.floor(1000 + Math.random() * 9000); // Alphanumeric password
  
      // Insert into the Login collection
      await loginCollection.insertOne({
        email,
        organization,
        orgEmail,
        password,
        createdAt: new Date(),
      });

  
      // Update the status in the Registration-Attempt collection to 'approved'
      const result = await attemptCollection.updateOne(
        { email, status: null }, // Ensure only pending registrations are approved
        { $set: { status: 'approved' } }
      );
  
      if (result.modifiedCount > 0) {
        // Send email to the user
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
  
        const mailOptions = {
          from: 'your-email@gmail.com', // Replace with your email
          to: email,
          subject: 'Registration Successful - Organization Login Details',
          html: `
            <p>Dear User,</p>
            <p>Your registration has been successfully approved.</p>
            <p>Here are our organization login details:</p>
            <ul>
              <li><strong>Organization Email:</strong> ${orgEmail}</li>
              <li><strong>Password:</strong> ${password}</li>
            </ul>
            <p>
              <a href="https://serene-rugelach-47cdf8.netlify.app/login" style="padding: 10px 20px; color: white; background-color: blue; text-decoration: none; border-radius: 5px;">
                Login to Your Account
              </a>
            </p>
            <p>Best regards,<br/>OnsiteIQ Team</p>
            <img src="/Main-Logo.png" alt="OnsiteIQ Logo" style="max-width: 200px; height: auto;" />
          `,
        };
  
        await transporter.sendMail(mailOptions);
  
        res.json({ success: true, message: 'Registration approved, email sent successfully!' });
      } else {
        res.json({ success: false, message: 'No pending registration found for this email or status already updated.' });
      }
    } catch (error) {
      console.error('Error in approving registration:', error);
      res.status(500).json({ success: false, message: 'Error in approving registration' });
    }
  });


  // Login password updation
        // Update Password
        app.post("/update-password", async (req, res) => {
          const { email, newPassword } = req.body;

          if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required." });
          }

          try {
            const client = new MongoClient(mongoUri);
            await client.connect();
            const database = client.db("OnsiteIQ");  // Connect to the OnsiteIQ database
            const collection = database.collection("LoginWorkersDetails");  // The LoginWorkersDetails collection

            // Find the user by email
            const user = await collection.findOne({ email });

            if (!user) {
              await client.close();
              return res.status(400).json({ message: "User not found" });
            }

            // Update the password field
            const result = await collection.updateOne(
              { email },
              { $set: { password: newPassword } }
            );

            if (result.modifiedCount === 1) {
              // Send confirmation email to the user
              const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                  user: process.env.EMAIL, // Your email address
                  pass: process.env.EMAIL_PASSWORD, // Your email password
                },
              });

              const orgEmail = user.orgEmail;  // The user's organization email
              const personalEmail = email; // The user's personal email

              const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "Password Updated Successfully",
                html: `
                <h2 style="color: green;">Password Updated Successfully</h2>
                  <p>Dear User,</p>
                  <p>Your password has been successfully updated.</p>
                  <p>Here are your updated login details:</p>
                  <ul>
                    <li><strong>Organization Email:</strong> ${orgEmail}</li>
                    <li><strong>Personal Email:</strong> ${personalEmail}</li>
                    <li><strong>Updated Password:</strong> ${newPassword}</li>
                  </ul>
                  <p>If you didn't request this change, please contact our support team immediately.</p>
                  <p>Best regards,<br>OnsiteIQ Team</p>
                `,
              };

              await transporter.sendMail(mailOptions);

              await client.close();
              res.status(200).json({ success: true, message: "Password updated successfully. Check your email for confirmation." });
            } else {
              await client.close();
              return res.status(400).json({ message: "Failed to update password. Please try again." });
            }
          } catch (error) {
            console.error("Error updating password:", error);
            return res.status(500).json({ message: "Failed to update password. Please try again." });
          }
        });

        // fetching personal Login Email and password
      app.get("/get-personal-login-details", async (req, res) => {
        try {
          // Connect to the database
          const db = client.db(dbName);
          const collection = db.collection('LoginWorkersDetails');
          
          // Find all login details and extract orgEmail and password fields
          const loginDetails = await collection.find({}).project({ email: 1, password: 1, _id: 0 }).toArray(); // Extract orgEmail and password fields
      
          if (loginDetails.length > 0) {
            // If login details are found, send them back as a response
            res.json({ success: true, loginDetails });
          } else {
            // If no login details are found
            res.json({ success: false, message: "No login details found." });
          }
        } catch (error) {
          console.error("Error retrieving login details:", error);
          res.status(500).json({ success: false, message: "Error retrieving login details." });
        }
      });


      // Workers Data
      // Define the collection name
      const workersCollection = "workersdata";

    // API endpoint to fetch all workers
    app.get("/api/workers", async (req, res) => {
      try {
        const db = client.db(dbName);
        const workers = await db.collection(workersCollection).find().toArray(); // Use the native MongoDB client method
        res.status(200).json(workers);
      } catch (err) {
        console.error("Error fetching workers:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // API endpoint to add a new worker
    app.post("/api/workers", async (req, res) => {
        const { name, role, email, phone, location } = req.body;
        try {
          const db = client.db(dbName);
          const newWorker = { name, role, email, phone, location };
          const result = await db.collection(workersCollection).insertOne(newWorker); // Insert the new worker
      
          res.status(201).json({
            message: "Worker added successfully!",
            worker: {
              _id: result.insertedId, // Use the insertedId from the result
              name,
              role,
              email,
              phone,
              location
            },
          });
        } catch (err) {
          console.error("Error adding worker:", err);
          res.status(500).json({ error: "Internal Server Error" });
        }
      });

      // Search abr members
      app.get("/api/workers/filter", async (req, res) => {
        const { role } = req.query; // Getting the role from the query parameters
        try {
          const db = client.db(dbName);
          const workers = await db.collection(workersCollection)
            .find({ role: { $regex: role, $options: 'i' } }) // Case-insensitive matching of role
            .toArray();
      
          res.status(200).json(workers);
        } catch (err) {
          console.error("Error fetching filtered workers:", err);
          res.status(500).json({ error: "Internal Server Error" });
        }
      });

      // DELETE API to remove worker data based on name, email, and phone
      app.delete("/api/delete-worker", async (req, res) => {
        const { name, email, phone } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ message: "Name, email, and phone are required." });
        }
        try {
            // Connect to MongoDB
            await client.connect();
            const db = client.db("OnsiteIQ");
            const collection = db.collection("workersdata");

            // Delete worker data based on name, email, and phone
            const result = await collection.deleteOne({ name, email, phone });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "Worker not found." });
            }

            res.status(200).json({ message: "Worker deleted successfully." });
        } catch (error) {
            console.error("Error deleting worker data:", error);
            res.status(500).json({ message: "Internal server error." });
        } finally {
            await client.close();
        }
      });
      
      // Construction Site
      // API to retrieve sites
      app.get("/api/sites", async (req, res) => {
        try {
          // Connect to the database
          const client = await MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
          const db = client.db("OnsiteIQSITE");
      
          // Retrieve the list of collection names
          const collections = await db.collections();
          
          const allSites = [];
      
          // Loop through each collection to get the first document
          for (const collection of collections) {
            const firstDocument = await collection.findOne(); // Get the first document from each collection
      
            if (firstDocument) {
              // Create a new object with the site ID (collection name) and the details
              const siteData = {
                siteID: firstDocument.customID, // Use collection name as site ID
                location: firstDocument.location,
                siteOwner: firstDocument.siteOwner,
                siteManager: firstDocument.siteManager,
                initiationDate: firstDocument.initiationDate,
                managerContact: firstDocument.managerContact,
                land: firstDocument.land,
              };
      
              // Add the site data to the array
              allSites.push(siteData);
            }
          }
      
          // Close the connection
          client.close();
      
          // Send the retrieved data as response
          res.status(200).json(allSites);
        } catch (error) {
          console.error("Error retrieving sites:", error);
          res.status(500).json({ error: "Failed to retrieve sites", details: error.message });
        }
      });


      // API to delete a collection
      app.delete("/api/sites/:id", async (req, res) => {
        try {
          const siteId = req.params.id; // Site ID corresponds to the collection name

          // Connect to the database
          const client = await MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
          const db = client.db("OnsiteIQSITE");

          // Check if the collection exists
          const collections = await db.listCollections({ name: siteId }).toArray();
          if (collections.length === 0) {
            client.close();
            return res.status(404).json({ message: "Collection not found" });
          }

          // Drop the collection
          await db.collection(siteId).drop();

          // Close the database connection
          client.close();

          // Send success response
          res.status(200).json({ message: "Collection deleted successfully" });
        } catch (error) {
          console.error("Error deleting collection:", error);
          res.status(500).json({ message: "Server error", details: error.message });
        }
      });


      // Construction  process update
      // API to update construction status
    app.put('/update-construction-status/:collectionName', async (req, res) => {
      const { collectionName } = req.params;
      const { siteID, constructionStatus } = req.body;
  
      if (!siteID) {
          return res.status(400).send({ message: 'Site ID is required' });
      }
  
      try {
          // Connect to the database
          const db = client.db("OnsiteIQSITE");
          console.log("Collection Name Received:", collectionName);
  
          // List and log available collections
          const collections = await db.listCollections().toArray();
          console.log("Available Collections:", collections.map(c => c.name));
  
          // Check if collection exists
          const collectionExists = collections.some(c => c.name === collectionName);
          if (!collectionExists) {
              return res.status(404).send({ message: 'Collection does not exist. Please ensure data is inserted first.' });
          }
  
          const collection = db.collection(collectionName);
  
          // Log the received siteID
          console.log("SiteID Received:", siteID.trim());
  
          // Query and update (or create new document if not found)
          const filter = { customID: siteID.trim() };
          const update = {
              $set: {
                  constructionStatus,
                  updatedAt: new Date() // Add current date and time
              },
              $setOnInsert: {
                  createdAt: new Date(), // Set creation time if this is a new document
                  customID: siteID.trim() // Ensure customID is set for a new document
              }
          };
  
          const result = await collection.findOneAndUpdate(
              filter,
              update,
              { returnDocument: 'after', upsert: true } // Upsert enabled
          );
  
          console.log("MongoDB FindOneAndUpdate Result:", result);
  
          // Send success response
          res.status(200).send({
              message: result.lastErrorObject?.updatedExisting
                  ? 'Construction status updated'
                  : 'New document created with construction status',
              result: result.value
          });
      } catch (error) {
          console.error('Error updating construction status:', error);
          res.status(500).send({ message: 'Error updating construction status', error });
      }
  });
            
      
      // Map Data process...
        app.post("/add-marker", async (req, res) => {
          const { siteOwner, siteManager, siteStartDate, managerPhone, groundWidth, groundHeight, latitude, longitude } = req.body;

          if (!latitude || !longitude) {
              return res.status(400).json({ message: "Latitude and longitude are required." });
          }

          try {
              // Save marker data to the database
              const newMarker = {
                  siteOwner,
                  siteManager,
                  siteStartDate,
                  managerPhone,
                  groundWidth,
                  groundHeight,
                  latitude,
                  longitude,
              };

              // Example: Insert the marker into a MongoDB collection
              const db = client.db("OnsiteIQ");
              const collectionName = "Map-Data";
              const result = await db.collection(collectionName).insertOne(newMarker);

              res.status(200).json({ message: "Marker added successfully", markerId: result.insertedId });
          } catch (error) {
              console.error("Error saving marker:", error);
              res.status(500).json({ message: "Error saving marker" });
          }
        });


        // API to get data from Map-Data Collection
        app.get('/api/get-map-data', async (req, res) => {
          try {
              // Connect to the MongoDB database
              await client.connect();

              // Access the 'OnsiteIQ' database and the 'Map-Data' collection
              const database = client.db('OnsiteIQ');
              const collection = database.collection('Map-Data');

              // Fetch all documents from the 'Map-Data' collection
              const data = await collection.find().toArray();

              // Send the data as the response
              res.json(data);
          } catch (error) {
              console.error("Error retrieving data:", error);
              res.status(500).send("Internal Server Error");
          } finally {
              // Close the MongoDB client connection
              await client.close();
          }
        });

        // API to delete a marker from the Map-Data Collection
        // Delete marker API endpoint
        // app.delete('/api/delete-map-data/:id', async (req, res) => {
        //   const { id } = req.params;
        //   try {
        //       // Find and delete the marker from the MapData collection using its unique ID
        //       const database = client.db('OnsiteIQ');
        //       const collection = database.collection('Map-Data');
        
        //       // Use deleteOne for deleting a document by ID
        //       const result = await collection.deleteOne({ _id: new ObjectId(id) });
        
        //       if (result.deletedCount === 0) {
        //           return res.status(404).json({ message: 'Marker not found' });
        //       }
              
        //       res.status(200).json({ message: 'Marker deleted successfully' });
        //   } catch (error) {
        //       res.status(500).json({ message: 'Error deleting marker', error: error.message });
        //   }
        // });

      //   app.delete('/api/delete-map-data/:id', async (req, res) => {
      //     const { id } = req.params;
          
      //     if (!ObjectId.isValid(id)) {
      //         return res.status(400).json({ message: 'Invalid marker ID' });
      //     }
      
      //     try {
      //         const database = client.db('OnsiteIQ');
      //         const collection = database.collection('Map-Data');
      
      //         const result = await collection.deleteOne({ _id: new ObjectId(id) });
      
      //         if (result.deletedCount === 0) {
      //             return res.status(404).json({ message: 'Marker not found' });
      //         }
      
      //         res.status(200).json({ message: 'Marker deleted successfully' });
      //     } catch (error) {
      //         console.error('Error in delete-map-data:', error);
      //         res.status(500).json({ message: 'Error deleting marker', error: error.message });
      //     }
      // });      

      // Delete marker route
app.delete('/api/delete-map-data/:id', async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid marker ID' });
  }

  try {
      // Get the database and collection
      const database = client.db('OnsiteIQ');
      const collection = database.collection('Map-Data');

      // Attempt to delete the marker
      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Marker not found' });
      }

      res.status(200).json({ message: 'Marker deleted successfully' });
  } catch (error) {
      console.error('Error deleting marker:', error.message);
      res.status(500).json({ message: 'Error deleting marker', error: error.message });
  }
});  

        // Contract API
        // Endpoint to handle form submission
          app.post('/submit-project', async (req, res) => {
            const formData = req.body;

            // Validate that the `CollectionName` is provided
            const collectionName = formData.CollectionName;
            if (!collectionName) {
                return res.status(400).json({ message: 'CollectionName is required!' });
            }

            try {
                // Connect to MongoDB
                const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
                await client.connect();

                const database = client.db('OnsiteIQSITE');
                const collection = database.collection(collectionName);

                // Insert form data into the specified collection
                const result = await collection.insertOne(formData);

                // Close the connection
                await client.close();

                res.status(200).json({
                    message: 'Project data submitted successfully!',
                    data: result,
                });
            } catch (error) {
                console.error('Error connecting to MongoDB:', error);
                res.status(500).json({ message: 'Failed to submit project data!', error });
            }
          });


          // To get the contract details from the collection
          app.get('/api/collections', async (req, res) => {
            const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        
            try {
                await client.connect();
                const db = client.db('OnsiteIQSITE');
                const collections = await db.collections(); // Get all collections
                
                let data = [];
        
                // Iterate through each collection and extract document[2]
                for (let collection of collections) {
                    const doc = await collection.findOne({}, { skip: 1, limit: 1 }); // Skip the first two docs and fetch the third one
        
                    if (doc) {
                        const { CollectionName, basicInformation } = doc;
                        data.push({ CollectionName, basicInformation });
                    }
                }
        
                res.json(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                res.status(500).send('Error fetching data');
            } finally {
                await client.close();
            }
        });
        

        // API to generate the contract PDF
        app.get("/api/generate-pdf/:collectionName", async (req, res) => {
          const collectionName = req.params.collectionName;
        
          try {
            // Connect to MongoDB
            await client.connect();
            const db = client.db("OnsiteIQSITE");
            const collection = db.collection(collectionName);
        
            // Fetch collection data
            const collectionData = await collection.findOne({ CollectionName: collectionName });
            if (!collectionData) {
              return res.status(404).send("Collection not found");
            }
        
            // Initialize PDF Document
            const doc = new PDFDocument({
              layout: "portrait",
              size: "A4",
            });
        
            // Pipe the PDF to the response
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
              "Content-Disposition",
              `attachment; filename="${collectionName}_contract.pdf"`
            );
            doc.pipe(res);
        
            // Add an image to the header (e.g., Stamp Paper Image)
            const stampImagePath = path.join(__dirname, "images", "Stamp Paper.jpg");
            doc.image(stampImagePath, 50, 50, { width: 500, height: 300 });
            doc.moveDown(25);
        
            // Global Line Spacing and Font Setup
            const lineSpacing = 2;
            doc.font("Helvetica").fontSize(13);
        
            // Helper Function for Adding Text with Line Spacing
            const addText = (text, options = {}) => {
              doc.text(text, { lineGap: lineSpacing, ...options });
            };
        
            // // Title
            // doc.font("Helvetica-Bold").fontSize(16).text("CONSTRUCTION AGREEMENT", {
            //   align: "center",
            //   underline: true,
            // });
            // doc.moveDown(2);
        
            // Introduction Section
            addText(`This Construction Agreement ("Agreement") is entered into on `, { continued: true });
            doc.font("Helvetica-Bold").text(`${collectionData.basicInformation.startDate}, `, { continued: true });
            doc.font("Helvetica").text(`by and between `, { continued: true });
            doc.font("Helvetica-Bold").text(`${collectionData.basicInformation.ownerName}, `, { continued: true });
            doc.font("Helvetica").text(`residing at `, { continued: true });
            doc.font("Helvetica-Bold").text(`${collectionData.siteDetails.siteAddress}, `, { continued: true });
            doc.font("Helvetica").text(`hereinafter referred to as "Owner," and `, { continued: true });
            doc.font("Helvetica-Bold").text(`${collectionData.basicInformation.contractorName}, `, { continued: true });
            doc.font("Helvetica").text(
              `hereinafter referred to as "Contractor." This Agreement also includes the participation of the Architect, `,
              { continued: true }
            );
            doc.font("Helvetica-Bold").text(`${collectionData.basicInformation.architectName}.`);
            doc.moveDown();
        
            // Project Overview
            addText(`The project, identified as `, { continued: true });
            doc.font("Helvetica-Bold").text(`${collectionData.CollectionName}, `, { continued: true });
            doc.font("Helvetica").text(`is titled `, { continued: true });
            doc.font("Helvetica-Bold").text(`${collectionData.basicInformation.projectName}, `, { continued: true });
            doc.font("Helvetica").text(`and is located at `, { continued: true });
            doc.font("Helvetica-Bold").text(`${collectionData.basicInformation.projectLocation}.`);
            doc.moveDown();
        
            addText(`The construction work is scheduled to commence on `, { continued: true });
            doc.font("Helvetica-Bold").text(`${collectionData.basicInformation.startDate} `, { continued: true });
            doc.font("Helvetica").text(`and is expected to be completed by `, { continued: true });
            doc.font("Helvetica-Bold").text(`${collectionData.basicInformation.completionDate}.`);
            doc.moveDown();
        
            // Permit and Approvals Section
            addText(`The project has been approved with Permit Number `, { continued: true });
            doc.font("Helvetica-Bold").text(`${collectionData.permitAndApproval.permitNumber}, `, { continued: true });
            doc.font("Helvetica").text(`classified under zoning as `, { continued: true });
            doc.font("Helvetica-Bold").text(`${collectionData.permitAndApproval.zoningClass}, `, { continued: true });
            doc.font("Helvetica").text(`and received approval on `, { continued: true });
            doc.font("Helvetica-Bold").text(`${collectionData.permitAndApproval.approvalDate}.`);
            doc.moveDown();
        
            // Site Details
            addText(`The construction site, measuring `, { continued: true });
            doc.font("Helvetica-Bold").text(`${collectionData.siteDetails.plotSize} sq. ft., `, { continued: true });
            doc.font("Helvetica").text(`is located at `, { continued: true });
            doc.font("Helvetica-Bold").text(`${collectionData.siteDetails.siteAddress}. `, { continued: true });
            doc.font("Helvetica").text(`The existing structures are noted as `, { continued: true });
            doc.font("Helvetica-Bold").text(`${collectionData.siteDetails.existingStructures}.`);
            doc.moveDown();
        
            // Budget Details
            addText(`The total estimated budget for the project is `, { continued: true });
            doc.font("Helvetica-Bold").text(`${collectionData.costAndBudget.estimatedBudget} INR, `, { continued: true });
            doc.font("Helvetica").text(`funded through `, { continued: true });
            doc.font("Helvetica-Bold").text(`${collectionData.costAndBudget.fundSource}. `, { continued: true });
            doc.font("Helvetica").text(`Payments are scheduled for `, { continued: true });
            doc.font("Helvetica-Bold").text(`${collectionData.costAndBudget.paymentSchedule}.`);
            doc.moveDown();
        
            // Safety and Compliance
            addText(`The project will adhere to all safety protocols as defined by `, { continued: true });
            doc.font("Helvetica-Bold").text(`OnsiteIQ. `, { continued: true });
            doc.font("Helvetica").text(`Emergency contact information for the site manager is `, { continued: true });
            doc.font("Helvetica-Bold").text(`${collectionData.safetyAndCompliance.emergencyContact}.`);
            doc.moveDown();
        
            // Signatures Section
            addText(`Signatures`);
            doc.text(`
              Owner: __________________________            
              Contractor: _______________________          
              Architect: ________________________           
              `);
        
            // Finalize the PDF
            doc.end();
            console.log("PDF created successfully");
          } catch (error) {
            console.error("Error generating PDF:", error);
            res.status(500).send("Error generating contract PDF");
          } finally {
            await client.close();
          }
        });
        
        // PPE
        // API to add PPE items
        app.post("/ppe", async (req, res) => {
          const ppeItems = req.body; // Array of PPE items

          try {
            const db = client.db('OnsiteIQ');
            const collection = db.collection('OnsiteIQ-PPE');
            await collection.insertMany(ppeItems); // Insert multiple PPE items
            res.status(201).send({ message: "PPE items added successfully." });
          } catch (error) {
            res.status(500).send({ error: "Failed to insert PPE items.", details: error.message });
          }
        });

        // // To update a specific PPE item
        // app.put("/ppe/:key", async (req, res) => {
        //   const { key } = req.params; // Get the 'key' from the URL
        //   const { value } = req.body; // Get the new 'value' from the request body

        //   try {
        //     const db = client.db('OnsiteIQ');
        //     const collection = db.collection('OnsiteIQ-PPE');
        //     const result = await collection.updateOne(
        //       { key }, // Find the document with the matching 'key'
        //       { $set: { value } } // Update the 'value' field
        //     );

        //     if (result.matchedCount === 0) {
        //       return res.status(404).send({ error: "PPE item not found." }); // Item not found
        //     }

        //     res.send({ message: "PPE item updated successfully." });
        //   } catch (error) {
        //     res.status(500).send({ error: "Failed to update PPE item.", details: error.message });
        //   }
        // });

        app.put("/ppe/:key", async (req, res) => {
          const { key } = req.params; // Get the 'key' from URL
          const { value } = req.body; // Get the 'value' from request body
        
          console.log("Key received:", key);
          console.log("Value to update:", value);
        
          try {
            const db = client.db('OnsiteIQ');
            const collection = db.collection('OnsiteIQ-PPE');
        
            // Log current state of data before update
            const existingData = await collection.findOne({ key });
            console.log("Existing data in DB:", existingData);
        
            const result = await collection.updateOne(
              { key: key }, // Ensure query field matches DB structure
              { $set: { value: value } } // Update the 'value'
            );
        
            console.log("Update result:", result);
        
            if (result.matchedCount === 0) {
              return res.status(404).send({ error: "PPE item not found." });
            }
        
            res.send({ message: "PPE item updated successfully." });
          } catch (error) {
            console.error("Error during update:", error.message);
            res.status(500).send({ error: "Failed to update PPE item.", details: error.message });
          }
        });
        
        
        // To get label and values from the backend
        app.get("/get-ppe", async (req, res) => {
          try {
            const db = client.db("OnsiteIQ");
            const collection = db.collection("OnsiteIQ-PPE");
        
            // Use projection to fetch only the `label` and `value` fields
            const data = await collection.find({}, { projection: { _id: 0, label: 1, value: 1 } }).toArray();
        
            res.status(200).send(data); // Send the filtered data as a JSON response
          } catch (error) {
            res.status(500).send({ error: "Failed to fetch PPE items.", details: error.message });
          }
        });

        // POST endpoint to handle form submission       
        app.post('/api/estimation', async (req, res) => {
          try {
            const estimationData = req.body;
        
            // Validate the incoming data
            if (!estimationData.projectName || !estimationData.projectLocation) {
              return res.status(400).json({ error: 'Project Name and Project Location are required' });
            }
        
             // Connect to the MongoDB database
             await client.connect();
        
            const database = client.db('OnsiteIQ');
            const collection = database.collection('Estimation-Data');
        
            // Insert the estimation data
            const result = await collection.insertOne(estimationData);
        
            // Log the result for debugging
            console.log('Insert result:', result);
        
            // Check if insertion was successful
            if (!result.insertedId) {
              return res.status(500).json({ error: 'Failed to insert estimation data' });
            }
        
            // Return success response with the inserted data ID
            res.status(201).json({
              message: 'Estimation data saved successfully',
              data: { insertedId: result.insertedId }
            });
        
          } catch (err) {
            console.error('Error saving estimation data:', err);
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
          }
        });

        // To get data from Estimation-Data
        app.get('/api/basic-info', async (req, res) => {
          try {
            const db = client.db('OnsiteIQ');
            const collection = db.collection('Estimation-Data');
        
            // Query the database and project only the basicInfo field
            const cursor = collection.find({}, { projection: { basicInfo: 1, _id: 0 } }); // Include only `basicInfo` and exclude `_id`
            const results = await cursor.toArray();
        
            // Check if results are empty
            if (!results.length) {
              return res.status(404).json({ error: 'No data found' });
            }
        
            // Return the data
            res.status(200).json(results);
          } catch (err) {
            console.error('Error fetching basic info:', err);
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
          }
        });
        
        
        // API to fetch data from MongoDB and generate a PDF
          app.get('/api/generate-pdf', async (req, res) => {
            const { projectName } = req.query; // Extract projectName from query params

            if (!projectName) {
              return res.status(400).json({ error: 'Project name is required' });
            }

            try {
              const db = client.db('OnsiteIQ');
              const collection = db.collection('Estimation-Data');

              // Fetch the estimation data for the specific project using the projectName
              const estimationData = await collection.findOne({ 'basicInfo.projectName': projectName });

              if (!estimationData) {
                return res.status(404).json({ error: 'No estimation data found for the specified project' });
              }

              // Generate PDF
              const outputPath = `./Estimation-${Date.now()}.pdf`;
              const doc = new PDFDocument({ margin: 50 });

              // Pipe the PDF to the file system
              const stream = fs.createWriteStream(outputPath);
              doc.pipe(stream);

              // Add Title and Logo
              doc
                .fillColor('#2C3E50')
                .fontSize(20)
                .text('OnsiteIQ Estimation Report', { align: 'center' })
                .moveDown(1);

              doc
                .lineWidth(2)
                .moveTo(50, doc.y)
                .lineTo(550, doc.y)
                .stroke('#2980B9');

              doc.moveDown(1.5);

              // Helper function for sections
              const addSection = (title, content, keyColor = '#2980B9', valueColor = '#2C3E50') => {
                doc
                  .fillColor(keyColor)
                  .fontSize(16)
                  .text(title, { underline: true })
                  .moveDown(1);

                doc.fillColor(valueColor).fontSize(12);
                Object.entries(content).forEach(([key, value]) => {
                  doc.moveDown(1);
                  doc.text(`${key}: ${value || 'N/A'}`);
                });
                doc.moveDown(2);
              };

              // Section: Basic Information
              addSection('Basic Information', {
                'Project Name': estimationData.basicInfo?.projectName,
                'Project Location': estimationData.basicInfo?.projectLocation,
                'Estimation Date': estimationData.basicInfo?.estimationDate,
                'Site Supervisor': estimationData.basicInfo?.siteSupervisor,
                'Project Scope': estimationData.basicInfo?.projectScope
              });

              // Section: Material Estimation
              addSection('Material Estimation', {
                'Cement Bags': estimationData.materialEstimation?.cementBags,
                'Steel (Tons)': estimationData.materialEstimation?.steelTons,
                'Bricks/Blocks': estimationData.materialEstimation?.bricks,
                'Sand (Cu.m)': estimationData.materialEstimation?.sand,
                'Gravel (Cu.m)': estimationData.materialEstimation?.gravel
              });

              // Section: Workforce Estimation
              addSection('Workforce Estimation', {
                'Laborers': estimationData.workforceEstimation?.laborers,
                'Specialists': estimationData.workforceEstimation?.specialists,
                'Man Hours': estimationData.workforceEstimation?.manHours
              });

              // Section: Cost Estimation
              
              addSection('Cost Estimation', {
                'Material Costs': estimationData.costEstimation?.materialCosts,
                'Labor Costs': estimationData.costEstimation?.laborCosts,
                'Equipment Costs': estimationData.costEstimation?.equipmentCosts,
                'Contingency Fund': estimationData.costEstimation?.contingencyFund,
                'Total Cost': estimationData.costEstimation?.totalCost
              });

              // Section: Timeline Estimation
              addSection('Timeline Estimation', {
                Progress: estimationData.timelineEstimation?.progress,
                'Completion Date': estimationData.timelineEstimation?.completionDate,
                Milestones: estimationData.timelineEstimation?.milestones,
                'Pending Tasks': estimationData.timelineEstimation?.pendingTasks
              });

              // Section: Equipment and Machinery
              addSection('Equipment and Machinery', {
                'Equipment Needed': estimationData.equipmentAndMachinery?.equipmentNeeded,
                'Usage Time': estimationData.equipmentAndMachinery?.usageTime,
                'Rental Cost': estimationData.equipmentAndMachinery?.rentalCost
              });

              // Section: Monitoring Observations
              addSection('Monitoring Observations', {
                'Material Wastage': estimationData.monitoringObservations?.materialWastage,
                Delays: estimationData.monitoringObservations?.delays,
                'Safety Compliance': estimationData.monitoringObservations?.safetyCompliance,
                'Resource Utilization': estimationData.monitoringObservations?.resourceUtilization
              });

              // Section: Additional Information
              addSection('Additional Information', {
                'Site Conditions': estimationData.additionalInfo?.siteConditions,
                'Weather Impact': estimationData.additionalInfo?.weatherImpact,
                Recommendations: estimationData.additionalInfo?.recommendations,
                Notes: estimationData.additionalInfo?.notes
              });

              // Footer
              doc
                .moveDown()
                .fillColor('#95A5A6')
                .fontSize(10)
                .text('Generated by OnsiteIQ ©', { align: 'center' });

              // Finalize the PDF
              doc.end();

              // Return the PDF file path to the client
              stream.on('finish', () => {
                res.download(outputPath, 'OnsiteIQ_Estimation.pdf', (err) => {
                  if (err) {
                    console.error('Error sending PDF:', err);
                  }
                  // Delete the file after download
                  fs.unlinkSync(outputPath);
                });
              });
            } catch (err) {
              console.error('Error generating PDF:', err);
              res.status(500).json({ error: 'Internal Server Error', details: err.message });
            }
          });


        // Material Process....
        // POST API to add data to the respective collection
        app.post('/api/materials/:siteID', async (req, res) => {
          const siteID = req.params.siteID; // Site ID as collection name
          const newMaterial = req.body; // Object with total, used, and labelName
        
          try {
            const db = client.db('OnsiteIQSITE');
            const collection = db.collection(siteID);
        
            // Insert the material
            const result = await collection.insertOne(newMaterial);
            res.status(201).json({ message: 'Material added successfully', data: result });
          } catch (err) {
            console.error('Error adding material:', err);
            res.status(500).json({ message: 'Error adding material', error: err });
          }
        });

        
        app.get('/api/materials/:siteID', async (req, res) => {
          const siteID = req.params.siteID; // Site ID as collection name
        
          try {
            const db = client.db('OnsiteIQSITE');
            const collection = db.collection(siteID);
        
            // Define the fixed set of labels
            const predefinedLabels = ["cement", "brick", "sand", "steel", "mixture", "plumbing"];
        
            // Filter to retrieve materials with matching labelName
            const filter = { labelName: { $in: predefinedLabels } };
        
            // Retrieve the materials matching the filter
            const materials = await collection.find(filter).toArray();
            res.status(200).json({ message: 'Materials retrieved successfully', data: materials });
          } catch (err) {
            console.error('Error retrieving materials:', err);
            res.status(500).json({ message: 'Error retrieving materials', error: err });
          }
        });
        
        app.put('/api/materials/:siteID/:labelName', async (req, res) => {
          const siteID = req.params.siteID; // Site ID as collection name
          const labelName = req.params.labelName; // Material label to update
          const updatedData = req.body; // Object containing updated total and/or used values
        
          try {
            const db = client.db('OnsiteIQSITE');
            const collection = db.collection(siteID);
        
            // Update the material with the specified labelName
            const result = await collection.updateOne(
              { labelName: labelName }, // Find the material by labelName
              { $set: updatedData } // Update the fields
            );
        
            if (result.modifiedCount > 0) {
              res.status(200).json({ message: 'Material updated successfully', data: result });
            } else {
              res.status(404).json({ message: 'Material not found', data: result });
            }
          } catch (err) {
            console.error('Error updating material:', err);
            res.status(500).json({ message: 'Error updating material', error: err });
          }
        });
        

        // For dashboard data
        app.get('/api/dashboard/materials/:siteID', async (req, res) => {
          const siteID = req.params.siteID;
          try {
            const db = client.db('OnsiteIQSITE');
            const collection = db.collection(siteID);
        
            // Fetch materials data with specific fields
            const materials = await collection.find({}, { projection: { labelName: 1, total: 1, used: 1, _id: 0 } }).toArray();
        
            if (materials.length === 0) {
              return res.status(404).json({ message: "No materials found for the provided siteID" });
            }
        
            res.status(200).json({
              message: "Materials retrieved successfully",
              data: materials,
            });
          } catch (err) {
            console.error("Error fetching materials:", err);
            res.status(500).json({ message: "Error fetching materials", error: err });
          }
        });
        
      

      // SiteOverview Process...
      // // API to Get All Documents from a Collection Based on Site ID
      // Site Overview
      app.get('/api/site-data/:siteID', async (req, res) => {
        const { siteID } = req.params;
      
        try {
          if (!siteID) {
            return res.status(400).json({ message: 'Site ID is required' });
          }
      
          const db = client.db('OnsiteIQSITE');
          const collection = db.collection(siteID); // Dynamically access collection by name
          const documents = await collection.find({}).toArray(); // Get all documents
      
          if (documents.length === 0) {
            return res.status(404).json({ message: 'No data found for the given Site ID' });
          }
      
          // Structure response
          const formattedData = {
            basicInformation: {},
            permitAndApproval: {},
            siteDetails: {},
            constructionSpecifications: {},
            workforceDetails: {},
            costAndBudget: {},
            safetyAndCompliance: {},
            additionalFeatures: {},
            materials: [],
          };
      
          documents.forEach(doc => {
            // Basic information
            if (doc.basicInformation) {
              formattedData.basicInformation = doc.basicInformation;
            }
      
            // Permit and approval
            if (doc.permitAndApproval) {
              formattedData.permitAndApproval = doc.permitAndApproval;
            }
      
            // Site details
            if (doc.siteDetails) {
              formattedData.siteDetails = doc.siteDetails;
            }
      
            // Construction specifications
            if (doc.constructionSpecifications) {
              formattedData.constructionSpecifications = doc.constructionSpecifications;
            }
      
            // Workforce details
            if (doc.workforceDetails) {
              formattedData.workforceDetails = doc.workforceDetails;
            }
      
            // Cost and budget
            if (doc.costAndBudget) {
              formattedData.costAndBudget = doc.costAndBudget;
            }
      
            // Safety and compliance
            if (doc.safetyAndCompliance) {
              formattedData.safetyAndCompliance = doc.safetyAndCompliance;
            }
      
            // Additional features
            if (doc.additionalFeatures) {
              formattedData.additionalFeatures = doc.additionalFeatures;
            }
      
            // Materials
            if (doc.labelName) {
              formattedData.materials.push({
                labelName: doc.labelName,
                total: doc.total,
                used: doc.used,
              });
            }
          });
      
          res.status(200).json({ data: formattedData });
        } catch (error) {
          console.error('Error retrieving site data:', error.message);
          res.status(500).json({ message: 'Error retrieving site data', error: error.message });
        }
      });

      // API for dashboard of button or site status
      // API to get constructionStatus by siteID
      app.get("/api/construction-status/:siteID", async (req, res) => {
        const { siteID } = req.params;

        // Ensure siteID is provided
        if (!siteID) {
          return res.status(400).json({ error: "Site ID is required." });
        }

        const client = new MongoClient(mongoUri);

        try {
          await client.connect();
          const dbName = "OnsiteIQSITE";
          const database = client.db(dbName);
          const collection = database.collection(siteID);

          // Query to find the document based on siteID
          const site = await collection.findOne({ customID: siteID });

          if (!site) {
            return res.status(404).json({ error: "Site not found." });
          }

          // Return only the constructionStatus
          res.json({ constructionStatus: site.constructionStatus });
        } catch (error) {
          console.error("Error fetching constructionStatus:", error);
          res.status(500).json({ error: "Internal Server Error" });
        } finally {
          await client.close();
        }
      });

      

        
// Start the server
app.listen(PORT, async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
});


