const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require('path');
const { MongoClient } = require("mongodb");
const { ObjectId } = require('mongodb');
const app = express();

// Middleware
app.use(cors());

app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// MongoDB connection (using your provided URL and OnsiteIQ database)
mongoose
  .connect("mongodb+srv://saikrishnan209:Sairam_22@cluster0.bvxx4.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected to database"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Schema (Static schema for site data, doesn't bind to a specific collection)
const siteSchema = new mongoose.Schema({
    location: { type: String, required: true },
    siteManager: { type: String, required: true },
    siteOwner: { type: String, required: true },
    initiationDate: { type: Date, required: true },
    land: { type: String, required: true },
    managerContact: { type: String, required: true },
    landBlueprint: { type: String, required: true },
    contractFile: { type: String, required: true },
    customID: { type: String, required: true, unique: true }, // user-provided ID
  });
  
  const Site = mongoose.model('Site', siteSchema);
  
  // File Uploads using Multer
  const upload = multer({ dest: 'uploads/' });
  upload.fields([{ name: 'landBlueprint' }, { name: 'contractFile' }]);
  
  // Routes
  app.post('/api/sites',
    upload.fields([{ name: 'landBlueprint' }, { name: 'contractFile' }]),
    async (req, res) => {
      try {
        // Log the incoming data
        console.log('Received data:', req.body);
        console.log('Files uploaded:', req.files);
  
        const {
          customID,
          location,
          siteManager,
          siteOwner,
          initiationDate,
          land,
          managerContact,
        } = req.body;
  
        // Validate that the customID is provided
        if (!customID) {
          return res.status(400).json({ error: 'customID is required' });
        }
  
        // Check if initiationDate is missing
        if (!initiationDate) {
          return res.status(400).json({ error: 'initiationDate is required' });
        }
  
        // Validate date format if necessary
        const validDate = Date.parse(initiationDate);
        if (isNaN(validDate)) {
          return res.status(400).json({ error: 'Invalid date format for initiationDate' });
        }
  
        const landBlueprint = req.files['landBlueprint'][0].path;
        const contractFile = req.files['contractFile'][0].path;
  
        // Create the site document with the user-provided customID
        const site = new Site({
          customID, // Use the customID provided by the user
          location,
          siteManager,
          siteOwner,
          initiationDate: new Date(initiationDate),
          land,
          managerContact,
          landBlueprint,
          contractFile,
        });
  
        // Save the site to the "Site" collection (general site collection)
        await site.save();
  
        // Now create the dynamic collection with the user-provided customID
        const db = mongoose.connection.useDb('OnsiteIQSITE'); // Switch to the "OnsiteIQSITE" database
  
        // Access the dynamic collection (using customID as collection name)
        const dynamicCollection = db.collection(customID);
  
        // Insert the full site data into the dynamic collection
        await dynamicCollection.insertOne({
          customID: site.customID, // Use the generated site ID for reference
          createdAt: new Date(),
          location: site.location,
          siteManager: site.siteManager,
          siteOwner: site.siteOwner,
          initiationDate: site.initiationDate,
          land: site.land,
          managerContact: site.managerContact,
          landBlueprint: site.landBlueprint,
          contractFile: site.contractFile,
          additionalData: 'Some related data for this site', // Optional field
        });
  
        res.status(201).json({ message: 'Site created successfully', site });
      } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Failed to create site', details: err.message });
      }
    }
  );
    
  // Get API used MongoDB Client
  
    // Delete a site by ID
        app.delete('/api/sites/:id', async (req, res) => {
            try {
            const siteId = req.params.id;
            const deletedSite = await Site.findByIdAndDelete(siteId);
            
            if (!deletedSite) {
                return res.status(404).json({ message: 'Site not found' });
            }
        
            res.status(200).json({ message: 'Site deleted successfully' });
            } catch (error) {
            console.error('Error deleting site:', error);
            res.status(500).json({ message: 'Server error' });
            }
        });


        // Alert Process...
        // Define schema and model
        const AlertSchema = new mongoose.Schema({
          workerName: { type: String, required: true },
          siteLocation: { type: String, required: true },
          image: { type: String, required: true },
          description: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
        });
        
        const Worker = mongoose.model('Alert', AlertSchema);
        
        // Multer setup for file upload
        const storage = multer.diskStorage({
          destination: (req, file, cb) => {
            cb(null, 'uploads/');
          },
          filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
          },
        });
        
        // API routes
        app.post('/api/alerts', upload.single('image'), async (req, res) => {
          try {
            const { workerName, siteLocation, description } = req.body;
        
            if (!req.file) {
              return res.status(400).json({ message: 'Image file is required' });
            }
        
            // Switch to the "OnsiteIQ" database
            const db = mongoose.connection.useDb('OnsiteIQ');
            const alertsCollection = db.collection('Alerts');
            
            // Save the alert to the "Alerts" collection
            const newAlert = {
              workerName,
              siteLocation,
              description,
              image: `/uploads/${req.file.filename}`,
              createdAt: new Date(),  // Ensure we add the creation timestamp
            };
        
            const savedAlert = await alertsCollection.insertOne(newAlert);
        
            // Fetch all emails from "LoginWorkersDetails"
            const workersCollection = db.collection('LoginWorkersDetails');
            const workers = await workersCollection.find({}, { projection: { email: 1 } }).toArray();
            
            // Extract emails from the workers
            const emailList = workers.map(worker => worker.email);
            
            // Set up the email transporter (e.g., using Gmail for this example)
            const transporter = nodemailer.createTransport({
              service: "Gmail",
              auth: {
                user: process.env.EMAIL, // Your email address
                pass: process.env.EMAIL_PASSWORD, // Your email password
              },
            });
        
            // Email content
            const mailOptions = {
              from: process.env.EMAIL,
              to: emailList.join(','),  // Send to all emails
              subject: 'New Alert Notification',
              html: `
                <html>
                  <head>
                    <style>
                      body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                      }
                      .email-container {
                        width: 100%;
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                      }
                      .header {
                        background-color: red;
                        color: white;
                        padding: 15px;
                        text-align: center;
                      }
                      .header h1 {
                        margin: 0;
                      }
                      .content {
                        padding: 20px;
                      }
                      .alert-details {
                        margin-bottom: 20px;
                      }
                      .alert-details p {
                        font-size: 16px;
                        color: #333;
                      }
                      .alert-details strong {
                        color: #007BFF;
                      }
                      .footer {
                        text-align: center;
                        padding: 10px;
                        background-color: #f1f1f1;
                        font-size: 14px;
                        color: #555;
                      }
                      .footer a {
                        color: #007BFF;
                        text-decoration: none;
                      }
                      .attachment {
                        margin-top: 20px;
                        text-align: center;
                      }
                      .attachment img {
                        max-width: 100%;
                        border-radius: 8px;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="email-container">
                      <div class="header">
                        <h1>New Alert From OnsiteIQ Team</h1>
                      </div>
                      <div class="content">
                        <div class="alert-details">
                          <p><strong>Worker Name:</strong> ${workerName}</p>
                          <p><strong>Site Location:</strong> ${siteLocation}</p>
                          <p><strong>Description:</strong> ${description}</p>
                          <p><strong>Alert Posted At:</strong> ${new Date().toLocaleString()}</p> <!-- Show date and time -->
                        </div>
                
                        <div class="attachment">
                          ${req.file ? `<p><strong>Attachment:</strong> ${req.file.originalname}</p>` : ''}
                          ${req.file ? `<img src="cid:alert-image" alt="Alert Image">` : ''}
                        </div>
                      </div>
                      <div class="footer">
                        <p>If you have any questions, please <a href="mailto:support@example.com">contact us</a>.</p>
                      </div>
                    </div>
                  </body>
                </html>
              `,
              attachments: [
                {
                  filename: req.file.originalname,  // Attach the uploaded image
                  path: req.file.path,
                  cid: 'alert-image',  // Inline image reference for HTML email
                },
              ],
            };
        
            // Send email to all workers
            await transporter.sendMail(mailOptions);
            
            res.status(201).json(savedAlert);  // Respond with the saved alert, including 'createdAt'
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
          }
        });
        

          // Getting login emails only
      app.get('/api/workers/emails', async (req, res) => {
        try {
          // Switch to the "OnsiteIQ" database
          const db = mongoose.connection.useDb('OnsiteIQ');
      
          // Access the "LoginWorkersDetails" collection
          const workersCollection = db.collection('LoginWorkersDetails');
      
          // Retrieve all worker details and select only the email field
          const workers = await workersCollection.find({}, { projection: { email: 1 } }).toArray();
      
          // Extract emails from the result
          const emails = workers.map(worker => worker.email);
      
          res.status(200).json({ emails });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal server error' });
        }
      });
      
      // Working on Alert-History
      app.get('/api/alerts/history', async (req, res) => {
        try {
          // Switch to the "OnsiteIQ" database
          const db = mongoose.connection.useDb('OnsiteIQ');
          
          // Access the "Alert" collection
          const alertsCollection = db.collection('Alerts');
      
          // Fetch all alerts from the collection and sort by timestamp
          const alerts = await alertsCollection.find().sort({ timestamp: -1 }).toArray();
      
          // Send the alerts as a response
          res.status(200).json(alerts);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error fetching alert history' });
        }
      });

      // Map process...
      // Delete marker route
      app.delete('/api/delete-map-data/:id', async (req, res) => {
        const { id } = req.params;
      
        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid marker ID' });
        }
      
        try {
            // Get the database and collection
            const mongoUri = "mongodb+srv://saikrishnan209:Sairam_22@cluster0.bvxx4.mongodb.net/";
            const client = new MongoClient(mongoUri);
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


// Exporting the express app 
// module.exports = { app };
  
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
