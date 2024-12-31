// Maintain the State After Page Reload: Use localStorage or sessionStorage 
// to store the last updated step,
// so that the page maintains the state on reload.
import React, { useEffect, useState } from "react";
import "../CSS/Progress.css";
import { useLocation } from "react-router-dom"; // Import useLocation
import Structure from "./Structure";
import { FaLocationDot } from "react-icons/fa6";
import blacktextlogo from "../Images/blacktextlogo.png";

function Progress() {
  // For Drop-Down
  const location = useLocation();
  const { siteDetails } = location.state || {}; // Retrieve site details from state

  const steps = [
    "Project Start",
    "Site Preparation",
    "Foundation Work",
    "Basement Construction",
    "Ground Floor Construction",
    "Floor Construction (1-N)",
    "Roof Construction",
    "Wall Construction",
    "Electrical Work",
    "Plumbing Work",
    "Interior Finishing",
    "Exterior Painting",
    "Furniture Installation",
    "Landscaping",
    "Project Handover",
  ];

  // Retrieve the current step from localStorage or default to 0
  const savedStep = localStorage.getItem(`currentStep_${siteDetails?.siteID}`);
  const [currentStep, setCurrentStep] = useState(savedStep ? parseInt(savedStep) : 0);

  // For pop up Acknowledgement
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [popupMessage, setPopupMessage] = useState(""); // Store the message to display in the popup

  useEffect(() => {
    // Store the current step in localStorage for that collection whenever it changes
    if (siteDetails?.siteID) {
      localStorage.setItem(`currentStep_${siteDetails.siteID}`, currentStep);
    }
  }, [currentStep, siteDetails?.siteID]);

  const handleClick = async (index) => {
    setCurrentStep(index + 1);
    // Send the updated status to the API
    if (siteDetails && siteDetails.siteID) {
      const updatedStatus = steps[index]; // Get the step name as the status
      const collectionName = `${siteDetails.siteID}`; // Correctly interpolate siteDetails.siteID
  
      try {
        // Make API call to update the construction status using fetch
        const response = await fetch(`http://localhost:5000/update-construction-status/${collectionName}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            siteID: siteDetails.siteID,
            constructionStatus: updatedStatus,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        console.log("Collection name:", collectionName);
        const data = await response.json();
        console.log("API Response:", data);
        // Show the success popup
        setPopupMessage(`Status for Site ID `);
        setShowPopup(true);
        
        // Close the popup after 5 seconds
        setTimeout(() => {
          setShowPopup(false);
        }, 5000);
      } catch (error) {
        console.error("Error updating construction status:", error);
      }
    }
  };
  
  // Define button positions dynamically
  const buttonPositions = [
    { top: 55, left: 100 }, // Position for button 1
    { top: 55, left: 280 }, // Position for button 2
    { top: 55, left: 490}, // Position for button 3
    { top: 62, left: 785 }, // Position for button 4
    { top: 155, left: 580 }, // Position for button 5
    { top: 155, left: 370 }, // Position for button 6
    { top: 160, left: -20 }, // Position for button 7
    { top: 255, left: 170 }, // Position for button 8
    { top: 255, left: 395 }, // Position for button 9
    { top: 262, left: 785 }, // Position for button 10
    { top: 355, left: 610 }, // Position for button 11
    { top: 355, left: 390 }, // Position for button 12
    { top: 362, left: -37 }, // Position for button 13
    { top: 455, left: 185 }, // Position for button 14
    { top: 455, left: 385 }, // Position for button 15
  ];

  return (
    <div className="Progress-MainScreens">
      <Structure />
      {/* Main Construction Details */}
      <div className="Construction-details">
        {siteDetails ? (
          <div>
            <div style={{ marginLeft: "80px" }}>
              <strong>
                <FaLocationDot size={30} fill="red" style={{ marginLeft: "-50px", marginTop: "20px" }} />
              </strong>
              <p style={{ marginTop: "-30px", marginLeft: "0px", fontWeight: 'bold' }}> {siteDetails.location}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', gap: '230px', textAlign: 'left', marginTop: '-20px' }}>
              <div style={{ marginLeft: "30px" }}>
                <p><strong>Site ID:</strong> {siteDetails.siteID}</p>
                <p><strong>Site Owner:</strong> {siteDetails.siteOwner}</p>
                <p><strong>Land Size:</strong> {siteDetails.land}</p>
              </div>
              <div>
                <img src={blacktextlogo} alt="OnsiteIQ Logo" style={{ width: "200px", height: "80px", opacity: "0.6" }} />
              </div>
              <div>
                <p><strong>Start Date:</strong> {new Date(siteDetails.initiationDate).toLocaleDateString()}</p>
                <p><strong>Site Manager:</strong> {siteDetails.siteManager}</p>
                <p><strong>Manager Contact:</strong> {siteDetails.managerContact}</p>
              </div>
            </div>
          </div>
        ) : (
          <p>No site details available.</p>
        )}
      </div>

      <div className="Progress-Main">
        <div className="progress-bar-container">
          <div className="progress-circles">
            <div className="progressc1"></div>
            <div className="progressc2"></div>
            <div className="progressc3"></div>
            <div className="progressc4"></div>
            <div className="progressc5"></div>
            <div className="progressc6"></div>
            <div className="progressc7"></div>
            <div className="progressc8"></div>
            <div className="progressc9"></div>
            <div className="progressc10"></div>
            <div className="progressc11"></div>
            <div className="progressc12"></div>
            <div className="progressc13"></div>
            <div className="progressc14"></div>
            <div className="progressc15"></div>
          </div>
          {/* Vertical and Horizontal Lines */}
          <div className={`line-1 ${currentStep >= 4 ? "filled" : ""}`}></div>
          <div className={`line-3 ${currentStep >= 7 ? "filled" : ""}`}></div>
          <div className={`line-4 ${currentStep >= 10 ? "filled" : ""}`}></div>
          <div className={`line-2 ${currentStep >= 13 ? "filled" : ""}`}></div>
          <div className={`horizontal-line-1 ${currentStep >= 1 ? "filled" : ""}`}></div>
          <div className={`horizontal-line-7 ${currentStep >= 2 ? "filled" : ""}`}></div>
          <div className={`horizontal-line-6 ${currentStep >= 3 ? "filled" : ""}`}></div>
          <div className={`horizontal-line-11 ${currentStep >= 5 ? "filled" : ""}`}></div>
          <div className={`horizontal-line-4 ${currentStep >= 6 ? "filled" : ""}`}></div>
          <div className={`horizontal-line-10 ${currentStep >= 8 ? "filled" : ""}`}></div>
          <div className={`horizontal-line-3 ${currentStep >= 9 ? "filled" : ""}`}></div>
          <div className={`horizontal-line-8 ${currentStep >= 11 ? "filled" : ""}`}></div>
          <div className={`horizontal-line-9 ${currentStep >= 12 ? "filled" : ""}`}></div>
          <div className={`horizontal-line-5 ${currentStep >= 14 ? "filled" : ""}`}></div>
          <div className={`horizontal-line-2 ${currentStep >= 15 ? "filled" : ""}`}></div>

          {/* Progress Buttons */}
          {steps.map((step, index) => (
            <div
              key={index}
              className="step-container"
              style={{
                position: "absolute",
                top: `${buttonPositions[index]?.top || 0}px`, // Use dynamic top positioning
                left: `${buttonPositions[index]?.left || 0}px`, // Use dynamic left positioning
              }}
            >
              <button
                className={`step-button ${currentStep >= index + 1 ? "filled" : ""}`}
                onClick={() => handleClick(index)}
                disabled={currentStep > index + 1} // Disable button if step has been completed
              >
                {step}
              </button>
            </div>
          ))}
        </div>
      </div>
      {showPopup && (
        <div className="process-popup-overlay">
          <div className="process-popup-message">
          <p>
            <span style={{ color: "black" }}>Status for Site ID </span>
            <span style={{ fontWeight: "bold", color: "green" }}>
              {siteDetails.siteID}
            </span>{" "}
            <span style={{ color: "black" }}>has been updated successfully!</span>
          </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Progress;
