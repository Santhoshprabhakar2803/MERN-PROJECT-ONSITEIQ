import React, { useState, useEffect } from "react";
import "../CSS/Sitedashboard.css";
import Structure from "./Structure";
import { useLocation } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import GaugeChart from "./GaugeChart";
import RadarChart from "./RadarChart";
import blacktextlogo from "../Images/blacktextlogo.png";
import { Doughnut } from "react-chartjs-2";
import ConstructionProgressChart from "../JS/ConstructionProgressChart.js";
import html2pdf from 'html2pdf.js/dist/html2pdf.min.js';
import { select } from "d3";
import "../CSS/CustomCircularProgressbar.css";

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
      fetch(`https://onsiteiq-server.onrender.com/api/construction-status/${siteDetails.siteID}`)
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
      fetch(`https://onsiteiq-server.onrender.com/api/dashboard/materials/${siteDetails.siteID}`)
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

  // Download
  const downloadPDF = () => {
    const element = document.body; // The entire page
    const options = {
      margin: 0.5,
      filename: 'page.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'px', format: [1500, 800], orientation: 'landscape' }
    };
    html2pdf().from(element).set(options).save();
  };

  // Bar Chart using D3.js (Vertical Bar)
  const BarChart = ({ value, labelName }) => {
    const ref = React.useRef();

    useEffect(() => {
      const width = 200;
      const height = 200;
      const margin = { top: 10, right: 10, bottom: 30, left: 30 };
      const svg = select(ref.current)
        .attr("width", width)
        .attr("height", height);

      const barHeight = (height - margin.top - margin.bottom) * (value / 100);

      svg
        .append("rect")
        .attr("x", margin.left)
        .attr("y", height - margin.bottom - barHeight)
        .attr("width", width - margin.left - margin.right)
        .attr("height", barHeight)
        .attr("fill", "#4db8ff");

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom - barHeight - 10)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text(`${value.toFixed(1)}%`);

    }, [value]);

    return (
      <div style={{
        width: '200px',
        height: '220px',
        textAlign: 'center',
        padding: '15px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        transition: 'transform 0.3s ease',
      }}>
        <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{labelName}</h4>
        <svg ref={ref}></svg>
      </div>
    );
  };

  return (
    <div className="Sitedashboard">
      <div style={{ marginTop: "0px" }}>
        <Structure />
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
        style={{ width: "250px", height: "40px", marginTop: "-190px", marginBottom: '120px', marginLeft: "1250px", backgroundColor: "green", color: "white", borderRadius: "5px", fontSize: "15px" }}>
        Download the visualized report
      </button>

      <div style={{ display: 'flex', marginLeft: '320px' }}>
        <div>
          <GaugeChart />
        </div>
      </div>

      <div className="sitedashnoard-main" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '25px',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto',
        marginLeft: '750px',
        marginTop: '-410px',
      }}>
        {materialsData.map((material, index) => (
          material.labelName && (
            <BarChart
              key={index}
              value={(material.used / material.total) * 100}
              labelName={material.labelName}
            />
          )
        ))}
      </div>

      <div style={{ marginTop: '-180px', marginLeft: '340px' }}>
        <RadarChart />
      </div>

      <div style={{ marginLeft: '-100px' }}>
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
