import React, { useState } from 'react';
import '../CSS/Page2.css';
import bg from '../Images/passwordimg4.jpg';

function Page2() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/api/delete-worker", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message || "Worker deleted successfully.");
        setShowModal(false); // Close the modal
        setFormData({ name: '', email: '', phone: '' }); // Reset form
      } else {
        alert(data.message || "Failed to delete worker.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };
  

  return (
    <div className="page-mainScreens">
      <img src={bg} alt="bgimage" className="bgimg" />

      <div className="container">
        <h1 className="heading">Welcome to the Official Page</h1>
        <button className="button" onClick={() => window.location.href = '/RegisterValidation'}>Register Validation</button>
        <button className="button" onClick={() => window.location.href = '/ContractDownloadPdf'}>Download Contract</button>
        <button className="button" onClick={() => window.location.href = '/EstimationDownload'}>Download Estimation</button>
        <button className="button" onClick={() => setShowModal(true)}>Delete Members</button>
      </div>

      {/* Modal for Deleting Members */}
      {showModal && (
        <div className="modal-overlayss">
          <div className="modal-contentss">
            <h2 className="modal-titless">Delete Member</h2>
            <form onSubmit={handleDelete}>
              <div className="form-groupss">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Name"
                  required
                />
              </div>
              <div className="form-groupss">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Email"
                  required
                />
              </div>
              <div className="form-groupss">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter Phone"
                  required
                />
              </div>
              <div className="form-actionsss">
                <button type="submit" className="modal-button confirmss">Delete</button>
                <button
                  type="button"
                  className="modal-button cancelss"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page2;
