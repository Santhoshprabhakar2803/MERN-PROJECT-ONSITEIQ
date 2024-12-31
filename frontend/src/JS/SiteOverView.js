// npm install html2pdf.js

import React, { useState, useEffect } from "react";
import "../CSS/SiteOverView.css";
import Structure from "./Structure";
import { useLocation } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import blacktextlogo from "../Images/blacktextlogo.png";
// import html2pdf from 'html2pdf.js';
import html2pdf from 'html2pdf.js/dist/html2pdf.min.js';
import { FaDownload } from "react-icons/fa";


function SiteOverView() {
    const location = useLocation();
    const { siteDetails } = location.state || {};

  const [apiData, setApiData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (siteDetails?.siteID) {
      console.log("Fetching data for siteID:", siteDetails.siteID);
      fetch(`https://onsiteiq-server.onrender.com/api/site-data/${siteDetails.siteID}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched API Data:", data);
          if (data.data) {
            setApiData(data.data); // apiData is an object
          } else {
            setError("No data found for the given Site ID.");
          }
        })
        .catch((error) => {
          console.error("Error fetching API data:", error.message);
          setError("Error fetching site data.");
        });
    }
  }, [siteDetails?.siteID]);


  const downloadPDF = () => {
    const element = document.body; // The entire page
    const options = {
      margin:       0.5,
      filename:     'page.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF: {
        unit: 'px',  
        format: [1500, 800],  
        orientation: 'landscape'  
      }
    };
    html2pdf().from(element).set(options).save();
  };
  
  
  return (
    <div className="site">
        <div>
            <Structure/>
        </div>
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
        

      {/* API Data Section */}
      <div className="api-data">
        <h2 style={{ marginLeft: "330px", marginTop: "30px" }}>
          Site Details Overview
        </h2>
        <button
          style={{
            color: "white",
            backgroundColor: "red",
            marginTop: "-50px",
            marginLeft:'1250px',
            display: "block",
            fontSize: "18px",
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }} 
          onClick={downloadPDF}
        >
          Download the page&nbsp;&nbsp;<FaDownload size={18}/>
        </button>
        {error ? (
          <p style={{ textAlign: "center", color: "red" }}>{error}</p>
        ) : (
          <div className="api-data-container">
            {Object.keys(apiData).map((key, index) => {
            // If the key is "materials", render as cards
            if (key === "materials" && Array.isArray(apiData[key])) {
              return (
                <div key={index}>
                  <h3>Materials Overview</h3>
                  {apiData[key].map((item, idx) => (
                    <div key={idx} className="api-card">
                      <h4 style={{color:'black'}}>{item.labelName}</h4>
                      <div className="api-row">
                        <div className="api-col">
                          <p>
                            <strong>Total:</strong> {item.total}
                          </p>
                        </div>
                        <div className="api-col">
                          <p>
                            <strong>Used:</strong> {item.used}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

            // Render other general site data
            if (typeof apiData[key] === "object" && !Array.isArray(apiData[key])) {
              return (
                <div key={index} className="api-card">
                  <h3>{key.replace(/([A-Z])/g, " $1").toUpperCase()}</h3>
                  {Object.entries(apiData[key]).map(([subKey, value], idx) => (
                    <div key={idx} className="api-row">
                      <div className="api-col">
                        <strong>{subKey.replace(/([A-Z])/g, " $1").toUpperCase()}:</strong>
                      </div>
                      <div className="api-col">
                        {/* Handle rendering of objects */}
                        {typeof value === "object" && value !== null ? (
                          <div>
                            {Object.entries(value).map(([innerKey, innerValue]) => (
                              <p key={innerKey}>
                                <strong>{innerKey.replace(/([A-Z])/g, " $1")}: </strong>
                                {innerValue}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p>{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

            return null; // For unsupported data types
          })}

          </div>
        )}
      </div>
    </div>
  );
}


export default SiteOverView;
