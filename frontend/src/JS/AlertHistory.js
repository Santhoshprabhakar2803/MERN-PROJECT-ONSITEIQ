import React, { useState, useEffect } from "react";
import "../CSS/AlertHistory.css";
import Structure from './Structure';
import { FaExclamationTriangle, FaCloudUploadAlt } from 'react-icons/fa';


function AlertHistory() {
  const [alertHistory, setAlertHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image for overlay

  // check
  //ghef
  // Fetch alerts when the component mounts
  useEffect(() => {
    const fetchAlertHistory = async () => {
      try {
        const response = await fetch('https://onsiteiq-image-server.onrender.com/api/alerts/history');
        const data = await response.json();
        setAlertHistory(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching alert history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlertHistory();
  }, []);

  // Function to handle image click and show overlay
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Function to close the overlay
  const closeOverlay = () => {
    setSelectedImage(null);
  };

  return (
    <div className="Alert-History">
      <div>
        <Structure />
      </div>
      <div className="Alert-Body">
      <FaExclamationTriangle size={40} className="alert-icon" style={{ fill: 'red' }} />
        <h1 style={{color:'red',marginLeft:'50px',marginTop:'-40px'}}>Alert History</h1>
        {isLoading && <p className="loading-text">Loading alerts...</p>}

        {!isLoading && alertHistory.length > 0 && (
          <div className="alert-list">
            {alertHistory.map((alert, index) => (
              <div key={index} className="alert-item">
                <div className="alert-header">
                  <h3>{alert.workerName}</h3>
                  <p className="alert-time">{new Date(alert.timestamp || alert.createdAt).toLocaleString()}</p>
                </div>
                <div className="alert-content">
                  <p><strong>Site Location:</strong> {alert.siteLocation}</p>
                  <p><strong>Description:</strong> {alert.description}</p>
                </div>
                {alert.image && (
                  <div className="image-container">
                    <button className="view-image-button" onClick={() => handleImageClick(`https://onsiteiq-image-server.onrender.com${alert.image}`)}>
                      View Image
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!isLoading && alertHistory.length === 0 && <p className="no-alerts-text">No alert history available.</p>}

        {/* Overlay for image */}
        {selectedImage && (
          <div className="overlay" onClick={closeOverlay}>
            <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
              <img src={selectedImage} alt="Selected" className="overlay-image" />
              <button className="close-overlay" onClick={closeOverlay}>X</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlertHistory;
