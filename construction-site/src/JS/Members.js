import React, { useEffect, useState } from "react";
import "../CSS/Members.css";
import { FaSearch } from "react-icons/fa";
import { IoPersonAddOutline } from "react-icons/io5";
import Structure from "./Structure";
import img1 from "../Images/worker.png";

// Modal Component
const Modal = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://onsiteiq-server.onrender.com/api/workers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Member added successfully!");
        onClose(); // Close the modal after success
        window.location.reload(); // Reload the page to fetch updated data
      } else {
        console.error("Failed to add member");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{backgroundColor:' rgba(255, 255, 255, 0.1)'}}>
        <h2 className="modal-title">Add Member</h2>
        <form onSubmit={handleSubmit}>
          {["name", "role", "email", "phone", "location"].map((field) => (
            <div className="form-group" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
              <input
                type="text"
                name={field}
                placeholder={`Enter ${field}`}
                value={formData[field]}
                onChange={handleChange}
              />
            </div>
          ))}
          <div className="modal-actions">
            <button type="button" onClick={onClose} style={{marginLeft:'180px',backgroundColor:'red',padding:'10px',color:'white',width:'100px'}}>
              Cancel
            </button>
            <button type="submit" style={{marginRight:'180px',backgroundColor:'green',padding:'10px',color:'white',width:'100px'}}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Table Component
const TableComponent = ({ workers }) => {
  if (!Array.isArray(workers) || workers.length === 0) {
    return <p className="no-data">No members found.</p>;
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => (
            <tr key={worker._id}>
              <td><img
            src={img1} // Ensure your worker object has an `imgUrl` property
            alt={`${worker.name}'s avatar`}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
          />{worker.name}</td>
              <td>{worker.role}</td>
              <td>{worker.email}</td>
              <td>{worker.phone}</td>
              <td>{worker.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main Members Component
function Members() {
  const [workers, setWorkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWorkers = async (role = "") => {
    try {
      const response = await fetch(`https://onsiteiq-server.onrender.com/api/workers/filter?role=${role}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setWorkers(data);
      } else {
        console.error("Invalid data format received from API:", data);
        setWorkers([]);
      }
    } catch (error) {
      console.error("Error fetching workers:", error);
      setWorkers([]); // Ensure workers is an array
    }
  };

  useEffect(() => {
    fetchWorkers(); // Fetch all workers on component mount
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Trigger fetch with role filter
    fetchWorkers(value);
  };

  const toggleModal = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  return (
    <div className="MainScreens">
      <div >
        <Structure />
      </div>

      <div className="members-container">
        <h1 className="mem-h1">Members</h1>
        <button className="Add-button-container" onClick={toggleModal}>
          <IoPersonAddOutline size={18} className="icon" /> Add
        </button>
        <div className="member-sentence">
          <p>
            "Committed to building the future, one project at a time, with
            unwavering dedication and expertise."
          </p>
        </div>
        
        <div className="Line"></div>

        <div className="search-bar2">
          <input
            type="text"
            placeholder="Filter Your Option here ..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{textAlign:'left',color:'white'}}
          />
        </div>

        {/* Table Component */}
        <TableComponent workers={workers} />
      </div>

      {/* Modal */}
      <Modal show={isModalOpen} onClose={toggleModal} />
    </div>
  );
}

export default Members;
