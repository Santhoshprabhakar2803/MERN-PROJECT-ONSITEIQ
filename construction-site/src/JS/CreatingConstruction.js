import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Structure from "./Structure";
import axios from "axios";  // Import Axios
import "../CSS/CreatingConstruction.css";
import { FaLocationDot } from "react-icons/fa6";
import blacktextlogo from "../Images/blacktextlogo.png";
import { useNavigate } from "react-router-dom";

function CreatingConstruction() {
  // Site creation:
  const [createSiteOpenModel, setcreateSiteOpenModel] = useState(false);
  const navigate = useNavigate();

  // Form data state
  const [location, setLocation] = useState("");
  const [siteManager, setSiteManager] = useState("");
  const [customID, setCustomID] = useState("");
  const [siteOwner, setSiteOwner] = useState("");
  const [initiationDate, setInitiationDate] = useState("");
  const [land, setLand] = useState("");
  const [managerContact, setManagerContact] = useState("");
  const [landBlueprint, setLandBlueprint] = useState(null);
  const [contractFile, setContractFile] = useState(null);
  const [siteData, setSiteData] = useState([]);
  // For delete
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [selectedSiteID, setSelectedSiteID] = useState(null);
  const [timer, setTimer] = useState(null);

  // Fetch site data from the backend
  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/sites");
        setSiteData(response.data);
        console.log("API Response:", response.data);
      } catch (error) {
        console.error("Error fetching site data:", error);
      }
    };
    fetchSiteData();
  }, []);

  // Open and Close Modal
  const openCreateSiteModel = () => {
    setcreateSiteOpenModel(true);
  };
  const closeCreateSiteModel = () => {
    setcreateSiteOpenModel(false);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.name === "landBlueprint") {
      setLandBlueprint(e.target.files[0]);
    } else if (e.target.name === "contractFile") {
      setContractFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new FormData object
    const formData = new FormData();
    formData.append("customID", customID);
    formData.append("location", location);
    formData.append("siteManager", siteManager);
    formData.append("siteOwner", siteOwner);
    formData.append("initiationDate", initiationDate);
    formData.append("land", land);
    formData.append("managerContact", managerContact);
    formData.append("landBlueprint", landBlueprint);
    formData.append("contractFile", contractFile);

    try {
      const response = await axios.post("http://localhost:3000/api/sites", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });
      console.log("Site created successfully:", response.data);
      setcreateSiteOpenModel(false); // Close modal after successful submission
      setSiteData([...siteData, response.data.site]);
      window.location.reload(); // Reload the page
    } catch (error) {
      console.error("Error creating site:", error);
    }
  };

  // Delete
  const handleMouseDown = (siteID) => {
    const newTimer = setTimeout(() => {
      setSelectedSiteID(siteID);
      setIsOverlayVisible(true);
    }, 1000); // Show overlay after 1 second
    setTimer(newTimer);
  };

  const handleMouseUp = () => {
    clearTimeout(timer); // Clear timer if mouse is released before 1 second
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/sites/${selectedSiteID}`);
      console.log(response.data.message);

      // Remove the deleted site from the UI
      setSiteData((prevData) => prevData.filter((site) => site.siteID !== selectedSiteID));

      // Show success message and close overlay
      alert("Site deleted successfully!");
      setIsOverlayVisible(false);
      setSelectedSiteID(null);
    } catch (error) {
      console.error("Error deleting site:", error);
      alert("Failed to delete the site.");
    }
  };

  // Double Tap
  const handleDoubleTap = (site) => {
    // Navigate to SubConstruction with site details
    navigate("/subconstruction", { state: { siteDetails: site } });
  };


  return (
    <div className="CreatingConstruction">
      <div className="structure">
        <Structure />
      </div>

      <div className="CreatingConstruction-layer1">
        <button className="create-site" onClick={openCreateSiteModel}>
          Create Site +
        </button>
        <hr style={{ border: "1px solid white", width: "80%", marginLeft: "300px", marginBottom: "10px" }} />
        <h2 className="Construction-heading">Construction Sites</h2>
      </div>

      {/* Render site blocks */}
      <div className="site-blocks">
        {siteData.map((site, index) => (
          <div key={index} className="site-block"
          // for 1second press
          onMouseDown={() => handleMouseDown(site.siteID)}
          onMouseUp={handleMouseUp}
          onTouchStart={() => handleMouseDown(site.siteID)}
          onTouchEnd={handleMouseUp}
          // For double tap
          onDoubleClick={() => handleDoubleTap(site)}>
            <div className="site-location">
              <span className="location-icon"><FaLocationDot size={35} fill="red"/></span> {/* Location icon */}
              <h3 style={{ marginLeft: "10px", marginTop: "10px", color: 'black' }}>{site.location}</h3>
            </div>
            <div className="site-details">
              <p><strong>Site ID:</strong> {site.siteID}</p>
              <p><strong>Site Manager:</strong> {site.siteManager}</p>
              <p><strong>Site Owner:</strong> {site.siteOwner}</p>
              <p><strong>Start Date:</strong> {new Date(site.initiationDate).toLocaleDateString()}</p>
              <p><strong>Manager Contact:</strong> {site.managerContact}</p>
              <p><strong>Land Size:</strong> {site.land}</p>
              <img src={blacktextlogo} alt="OnsiteIQ Logo" style={{ width: "130px", height: "50px", marginTop: "-50px", marginLeft: "175px" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Creating a Site */}
      <Modal
        className="modal-create-site"
        isOpen={createSiteOpenModel}
        onRequestClose={closeCreateSiteModel}
        contentLabel="Creating site model"
        overlayClassName="overlay"
      >
        <h1 style={{ color: "black", textAlign: "center" }}> Creating a new Dream!</h1>

        {/* Form for site creation */}
        <form onSubmit={handleSubmit}>
  <div className="row">
    <div className="input-container">
      <label>Location of the site:</label>
      <input
        type="text"
        placeholder="Site Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
    </div>

    <div className="input-container">
      <label>Enter Site ID:</label>
      <input
        type="text"
        placeholder="Site ID"
        value={customID}
        onChange={(e) => setCustomID(e.target.value)}
      />
    </div>

    <div className="input-container">
      <label>Site Manager:</label>
      <input
        type="text"
        placeholder="Site Manager"
        value={siteManager}
        onChange={(e) => setSiteManager(e.target.value)}
      />
    </div>
  </div>

  <div className="row">
    <div className="input-container">
      <label>Site Owner:</label>
      <input
        type="text"
        placeholder="Site Owner"
        value={siteOwner}
        onChange={(e) => setSiteOwner(e.target.value)}
      />
    </div>

    <div className="input-container">
      <label>Site Initiation Date:</label>
      <input
        type="date"
        value={initiationDate}
        onChange={(e) => setInitiationDate(e.target.value)}
      />
    </div>

    <div className="input-container">
      <label>Site Land Measurements:</label>
      <input
        type="text"
        value={land}
        placeholder="Land Measurements"
        onChange={(e) => setLand(e.target.value)}
      />
    </div>
  </div>

  <div className="row">
    <div className="input-container">
      <label>Manager Contact Number:</label>
      <input
        type="number"
        placeholder="Manager Contact Number"
        value={managerContact}
        onChange={(e) => setManagerContact(e.target.value)}
      />
    </div>

    <div className="input-container">
      <label>Land BluePrint Plan:</label>
      <input
        type="file"
        name="landBlueprint"
        accept=".pdf"
        onChange={handleFileChange}
      />
    </div>

    <div className="input-container">
      <label>Contract File:</label>
      <input
        type="file"
        name="contractFile"
        accept=".pdf"
        onChange={handleFileChange}
      />
    </div>
  </div>

  <button className="submitBtn" type="submit">Create Site</button>
</form>

      </Modal>

        {/* Overlay for deletion */}
      {isOverlayVisible && (
        <div className="overlay">
          <div className="overlay-content">
            <h2 style={{marginLeft: "15px", color: "black"}}>Delete Site</h2>
            <p>Are you sure you want to delete site with ID: <strong>{selectedSiteID}</strong>?</p>
            <button className="delete-button" onClick={handleDelete}>Delete</button>
            <button className="cancel-button" onClick={() => setIsOverlayVisible(false)}>Cancel</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default CreatingConstruction;
