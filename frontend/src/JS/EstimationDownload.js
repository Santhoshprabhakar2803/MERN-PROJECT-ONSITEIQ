import React, { useState, useEffect } from "react";
import "../CSS/EstimationDownload.css";
import Structure from './Structure';

function EstimationDownload() {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="EstimationDownload-Main">
        <div>
            <Structure/>
        </div>
        <div className="EstimationDownload">
      {basicInfoList.map((item, index) => (
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
      ))}
    </div>

    </div>
  );
}

export default EstimationDownload;
