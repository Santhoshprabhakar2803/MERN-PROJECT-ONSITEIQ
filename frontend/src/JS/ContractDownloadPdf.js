import React, { useState, useEffect } from "react";
import "../CSS/ContractDownloadPdf.css";
import Structure from "./Structure";

function ContractDownloadPdf() {
    const [collections, setCollections] = useState([]);

    // Fetch collections data from the backend API using fetch
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await fetch('https://onsiteiq-server.onrender.com/api/collections');
                const data = await response.json();
                setCollections(data);
            } catch (error) {
                console.error('Error fetching collections:', error);
            }
        };

        fetchCollections();
    }, []);

    // Function to handle contract download (placeholder functionality)
    const handleDownload = async (collectionName) => {
        const response = await fetch(`https://onsiteiq-server.onrender.com/api/generate-pdf/${collectionName}`, {
            method: "GET",
        });
    
        if (response.ok) {
            // Open the PDF in a new tab or trigger download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${collectionName}_contract.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } else {
            alert("Failed to download contract.");
        }
    };
    
    return (
        <div className="contract-main">
            <Structure />
            <div className="contract-pdf">
                {collections.length === 0 ? (
                    <p className="loading-text">Loading collections...</p>
                ) : (
                    collections.map((collection, index) => (
                        <div key={index} className="contract-card">
                            <h3 className="contract-card-title">{collection.CollectionName}</h3>
                            {collection.basicInformation ? (
                                <div className="basic-info">
                                    {/* <div className="info-row"> */}
                                        <p><strong>Project Name:</strong> {collection.basicInformation.projectName}</p>
                                        <p><strong>Project Location:</strong> {collection.basicInformation.projectLocation}</p>
                                    {/* </div>
                                    <div className="info-row"> */}
                                        <p><strong>Start Date:</strong> {collection.basicInformation.startDate}</p>
                                        <p><strong>Completion Date:</strong> {collection.basicInformation.completionDate}</p>
                                    {/* </div>
                                    <div className="info-row"> */}
                                        <p><strong>Construction Type:</strong> {collection.basicInformation.constructionType}</p>
                                        <p><strong>Architect Name:</strong> {collection.basicInformation.architectName}</p>
                                    {/* </div>
                                    <div className="info-row"> */}
                                        <p><strong>Contractor Name:</strong> {collection.basicInformation.contractorName}</p>
                                        <p><strong>Owner Name:</strong> {collection.basicInformation.ownerName}</p>
                                    </div>
                                // </div>
                            ) : (
                                <p className="no-info">Basic information not available for this collection.</p>
                            )}
                            <button onClick={() => handleDownload(collection.CollectionName)} className="download-button">
                                Download Contract
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ContractDownloadPdf;
