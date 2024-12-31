import React, { useState, useEffect } from "react";
import "../CSS/Sitedashboard.css";
import Structure from "./Structure";
import { useLocation } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import GaugeChart from "./GaugeChart";
import RadarChart from "./RadarChart";
import blacktextlogo from "../Images/blacktextlogo.png";
import { CircularProgressbar } from "react-circular-progressbar"; // Circular Progressbar import
import 'react-circular-progressbar/dist/styles.css'; // Styles for CircularProgressbar
import ConstructionProgressChart from "../JS/ConstructionProgressChart.js";
import html2pdf from 'html2pdf.js/dist/html2pdf.min.js';


// Chart.js registration
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables); // Register all necessary components for Chart.js

function Sitedashboard() {
    const location = useLocation();
    const { siteDetails } = location.state || {};
    const [materialsData, setMaterialsData] = useState([]);

    const [currentStatus, setCurrentStatus] = useState("");
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
    "Project Handover"
  ];

  // Site Status
  useEffect(() => {
    if (siteDetails && siteDetails.siteID) {
      fetch(`http://localhost:5000/api/construction-status/${siteDetails.siteID}`)
        .then((response) => response.json())
        .then((data) => {
          setCurrentStatus(data.constructionStatus);
        })
        .catch((error) => console.error("Error fetching construction status:", error));
    }
  }, [siteDetails]);

  // Materials Data
    useEffect(() => {
        if (siteDetails && siteDetails.siteID) {
            fetch(`http://localhost:5000/api/dashboard/materials/${siteDetails.siteID}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then((data) => {
                    try {
                        const jsonData = JSON.parse(data);
                        if (jsonData.data) {
                            setMaterialsData(jsonData.data);
                        } else {
                            console.error('Unexpected response format:', jsonData);
                        }
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                        alert('There was an error parsing the response data.');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching materials:', error);
                    alert('There was an error fetching the materials data.');
                });
        }
    }, [siteDetails]);

    // Downlaod
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
        <div className="Sitedashboard">
            <div style={{ marginTop: "0px" }}>
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
            </div>

            <button onClick={downloadPDF}
            style={{width:"250px",height:"40px",marginTop:"-190px",marginBottom:'120px',marginLeft:"1250px",backgroundColor:"green",color:"white",borderRadius:"5px",fontSize:"15px"}}>
                Download the visualized report</button>


            <div style={{ display: 'flex' ,marginLeft:'320px'}}>
                <div>
                    <GaugeChart />
                </div>
            </div>
             {/* Main */}
            <div className="sitedashnoard-main" style={{
                display: 'grid', // Use grid for layout
                gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns
                gap: '25px', // Minimal gap between the charts
                justifyContent: 'center', // Center the grid
                alignItems: 'center', // Vertically align the grid
                margin: '0 auto', // Center the entire grid container
                // paddingTop: '20px',
                marginLeft: '750px',
                marginTop:'-410px',
                // border:'2px solid white',
            }}>
                {/* Render Circular Gauge charts in a grid layout */}
                {materialsData.map((material, index) => (
                    material.labelName && (
                        <div key={index} style={{
                            width: '200px',
                            height: '220px',
                            textAlign: 'center',
                            padding: '15px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            // border: '1px solid #ccc',
                            borderRadius: '8px',
                            transition: 'transform 0.3s ease', // Smooth scale transition
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)'; // Zoom in effect on hover
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)'; // Zoom out effect when hover ends
                        }}
                        >
                            <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
                                {material.labelName}
                            </h4>
                            <CircularProgressbar
                                value={(material.used / material.total) * 100}
                                text={`${((material.used / material.total) * 100).toFixed(1)}%`}
                                styles={{
                                    path: { stroke: '#4db8ff' },
                                    trail: { stroke: '#f4f4f4' },
                                    text: { fill: 'green', fontSize: '14px', fontWeight: 'bold' }
                                }}
                            />
                        </div>
                    )
                ))}
            </div>

            <div style={{marginTop:'-180px',marginLeft:'340px'}}>
                    <RadarChart />
            </div>

            <div style={{marginLeft:'-100px'}}>
                <h2 style={{ textAlign: "center", marginTop: "30px" }}>Construction Progress</h2>
                {currentStatus ? (
                <ConstructionProgressChart steps={steps} currentStatus={currentStatus} />
                ) : (
                <p>Loading construction progress...</p>
                )}
            </div>

        </div>
    );
}

export default Sitedashboard;
