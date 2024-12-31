import React, { useState } from 'react';
import { FaExclamationTriangle, FaCloudUploadAlt } from 'react-icons/fa';
import Structure from './Structure';
import { useNavigate } from "react-router-dom";
import '../CSS/Alert.css';

const Alert = () => {
    const [formData, setFormData] = useState({
        workerName: '',
        siteLocation: '',
        description: '',
        image: null
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setFormData(prevState => ({
            ...prevState,
            image: file
        }));
    };

    // process..    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const form = new FormData();
        form.append('workerName', formData.workerName);
        form.append('siteLocation', formData.siteLocation);
        form.append('description', formData.description);
        form.append('image', formData.image);
    
        try {
          const response = await fetch('https://onsiteiq-image-server.onrender.com/api/alerts', {
            method: 'POST',
            body: form,
          });
    
          if (!response.ok) {
            throw new Error('Failed to submit the alert');
          }
    
          const data = await response.json();
          alert('Your Alert Message is Notified To all Officials')
          console.log('Alert submitted:', data);
        } catch (error) {
          console.error('Error:', error);
        }
      };

      const viewhistory =()=>{
        navigate("/AlertHistory")
      }
    
    return (
        <div className="alert-container">
            <div>
                <Structure />
            </div>
            
            <div className="alert-form">
                <div className="header-section">
                    <div className="alert-header">
                        <FaExclamationTriangle className="alert-icon" style={{ fill: 'red' }} />
                        <span className="alert-text">Alert:</span>
                    </div>
                    <button onClick={viewhistory}className="history-button">View History</button>
                </div>

                <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <div className="form-field">
                            <label htmlFor="workerName">Worker Name</label>
                            <input
                                type="text"
                                id="workerName"
                                name="workerName"
                                value={formData.workerName}
                                onChange={handleInputChange}
                                required
                            />
                            </div>

                            <div className="form-field">
                            <label htmlFor="siteLocation">Site Location</label>
                            <input
                                type="text"
                                id="siteLocation"
                                name="siteLocation"
                                value={formData.siteLocation}
                                onChange={handleInputChange}
                                required
                            />
                            </div>

                            <div className="form-field">
                            <label htmlFor="image">Upload Image</label>
                            <div className="upload-button-container">
                                <input
                                type="file"
                                id="image"
                                name="image"
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="upload-input"
                                />
                                <div className="upload-button-overlay">
                                <FaCloudUploadAlt className="upload-icon" />
                                <span>Choose File</span>
                                </div>
                            </div>
                            </div>
                        </div>

                        <div className="description-field">
                            <label htmlFor="description" className="description-label">
                            Description:
                            </label>
                            <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Give a detailed explanation of the incident please..."
                            required
                            />
                        </div>

                        <button type="submit" className="submit-button-Alert">
                            Submit
                        </button>
                    <p className="footer-note">
                        This will be automatically sent to site manager and other officials once sent!
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Alert;