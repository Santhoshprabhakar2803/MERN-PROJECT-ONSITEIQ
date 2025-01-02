import React, { useState, useEffect } from "react";
import "../CSS/EstimationDownload.css";
import Structure from './Structure';

function DownloadEstimationData() {
  const [basicInfoList, setBasicInfoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchBasicInfo = async () => {
      try {
        const response = await fetch("https://onsiteiq-server.onrender.com/api/basic-info");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setBasicInfoList(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBasicInfo();
  }, []);

  const handleDownload = async (projectName) => {
    try {
      const response = await fetch(`https://onsiteiq-server.onrender.com/api/generate-pdf?projectName=${projectName}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      // Create a link to download the PDF
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName}-Estimation.pdf`;  // Name the file based on the project name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Release the blob URL
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  // Render structure (Header, Sidepanel) before fetching data
  return (
    <div className="EstimationDownload-Main">
      <Structure /> {/* Assuming Structure includes Header and SidePanel */}

      {/* Conditionally render content based on API request status */}
      <div className="EstimationDownload">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <>
            {/* Show header and side panel even if there is an error */}
            <div>Error: {error}</div>
            <p>Try again later</p>
          </>
        ) : (
          basicInfoList.length > 0 ? (
            basicInfoList.map((item, index) => (
              <div key={index} className="basic-info-block">
                <h3>{item.basicInfo.projectName}</h3>
                <p><strong>Location:</strong> {item.basicInfo.projectLocation}</p>
                <p><strong>Estimation Date:</strong> {item.basicInfo.estimationDate}</p>
                <p><strong>Site Supervisor:</strong> {item.basicInfo.siteSupervisor}</p>
                <p><strong>Project Scope:</strong> {item.basicInfo.projectScope}</p>
                
                <button
                  className="download-button"
                  onClick={() => handleDownload(item.basicInfo.projectName)}
                >
                  Download Estimation
                </button>
              </div>
            ))
          ) : (
            <div>No data available</div>
          )
        )}
      </div>
    </div>
  );
}

export default DownloadEstimationData;
