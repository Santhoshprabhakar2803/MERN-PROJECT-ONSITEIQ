import React, { useEffect, useState } from "react";
import "../CSS/Material.css";
import Structure from "./Structure";
import cement from "../Images/cement.png";
import brick from "../Images/brick.png";
import sand from "../Images/sand.png";
import steel from "../Images/steel.png";
import mixture from "../Images/mixture.png";
import plumbing from "../Images/plumbing.png";
import badgeIcon from "../Images/product.png";
import { useLocation } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import blacktextlogo from "../Images/blacktextlogo.png";

function Material() {
  const location = useLocation();
  const { siteDetails } = location.state || {};
  // State for material quantities
  const [ppeValues, setPpeValues] = useState({
    cement: 0,
    brick: 0,
    sand: 0,
    steel: 0,
    mixture: 0,
    plumbing: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    labelName: "",
    total: "",
    used: "",
  });

  // Handle input changes for the new material form
  const handleNewMaterialChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleAddMaterial = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://onsiteiq-server.onrender.com/api/materials/${siteID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMaterial),
      });

      if (!response.ok) {
        throw new Error("Failed to add material");
      }

      const result = await response.json();
      alert("Material added successfully!");
      console.log("Added Material:", result);

      // Clear form fields and close modal
      setNewMaterial({
        labelName: "",
        total: "",
        used: "",
      });
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding material:", error);
    }
  };


  const siteID = siteDetails.siteID;

  // Fetch site details and materials on mount
  useEffect(() => {
    fetch(`https://onsiteiq-server.onrender.com/api/materials/${siteID}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Check if the response has the expected data structure
        const materials = data?.data || []; // Adjust based on API response format
  
        // Safeguard against empty or undefined data
        if (!Array.isArray(materials)) {
          throw new Error("Unexpected data structure from API");
        }
  
        // Map materials into badgeValues and ppeValues
        const materialValues = {};
        const badgeValues = {};
        materials.forEach((material) => {
          const { labelName, total = 0, used = 0 } = material;
          materialValues[labelName] = used; // Keep the exact "used" value
          badgeValues[labelName] = total; // Keep the exact "total" value
        });
  
        // Update state with fetched values
        setPpeValues(materialValues);
        setBadgeValues(badgeValues);
  
        console.log("Fetched materials:", materials);
      })
      .catch((error) => console.error("Error fetching materials:", error));
  }, [siteID]);
  

  // State for material input editing
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState(null);

  // Handle material input change
  const handleMaterialInputChange = (e) => {
    const { value } = e.target;
    setTempValue(value ? Number(value) : "");
  };

  const handleMaterialInputBlur = async () => {
    if (editingField !== null && tempValue !== null) {
      if (tempValue > badgeValues[editingField]) {
        alert("Used value cannot exceed the total badge value.");
        setEditingField(null);
        setTempValue(null);
        return; // Exit the function if validation fails
      }
  
      try {
        // Send the input value directly to the backend
        const response = await fetch(
          `https://onsiteiq-server.onrender.com/api/materials/${siteID}/${editingField}`,
          {
            method: "PUT", // Assuming PUT is used for updates
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              used: tempValue, // Send the used value as entered
            }),
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to update material value");
        }
  
        // Update the local state after a successful API call
        setPpeValues((prevValues) => ({
          ...prevValues,
          [editingField]: tempValue,
        }));
        alert("Material value updated successfully");
      } catch (error) {
        console.error("Error updating material value:", error);
      }
    }
  
    // Reset editing state
    setEditingField(null);
    setTempValue(null);
  };
  
  
  const handleMaterialDoubleClick = async(field) => {
    setEditingField(field);
    setTempValue(ppeValues[field]);
  };

  // Separate state for badge quantities
  const [badgeValues, setBadgeValues] = useState({
    cement: 0,
    brick: 0,
    sand: 0,
    steel: 0,
    mixture: 0,
    plumbing: 0,
  });

  const [badgeEditingField, setBadgeEditingField] = useState(null);
  const [badgeTempValue, setBadgeTempValue] = useState(null);

  const handleBadgeInputChange = (e) => {
    const { value } = e.target;
    setBadgeTempValue(value ? Number(value) : "");
  };

  const handleBadgeInputBlur = async () => {
    if (badgeEditingField !== null && badgeTempValue !== null) {
      try {
        // Send the input value directly to the backend
        const response = await fetch(`https://onsiteiq-server.onrender.com/api/materials/${siteID}/${badgeEditingField}`, {
          method: "PUT", // Assuming PUT is used for updates
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            total: badgeTempValue, // Send the total value as entered
          }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to update badge value");
        }
  
        // Update the local state after a successful API call
        setBadgeValues((prevValues) => ({
          ...prevValues,
          [badgeEditingField]: badgeTempValue,
        }));
        alert("Badge Updated Successfully");
      } catch (error) {
        console.error("Error updating badge value:", error);
      }
    }
  
    // Reset editing state
    setBadgeEditingField(null);
    setBadgeTempValue(null);
  };
  
  
  const handleBadgeDoubleClick = async(field) => {
    setBadgeEditingField(field);
    setBadgeTempValue(badgeValues[field]);
    console.log(`Editing field badge to: ${field}`);
    console.log(`Editing field set to: ${badgeValues[field]}`);
  };
  

  return (
    <div className="Material-MainScreens">      
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
      <button onClick={() => setShowModal(true)}
        style={{width:"150px",height:"40px",marginTop:"-190px",marginBottom:'120px',marginLeft:"1250px",backgroundColor:"green",color:"white",borderRadius:"5px",fontSize:"15px"}}>Add New Material</button>

      <div className="Material-main">
        <div className="Material-content">
          {/* Cement */}
          <div className="Material-cement" style={{ position: "relative" }}>
            <h3 className="Material-title">Cement</h3>
            <div className="Material-top-right">
              <img src={badgeIcon} alt="Badge" className="badge-icon" />
              {badgeEditingField === "cement" ? (
                <input
                  type="number"
                  value={badgeTempValue !== null ? badgeTempValue : ""}
                  onChange={handleBadgeInputChange}
                  onBlur={handleBadgeInputBlur}
                  className="badge-qty-input"
                  autoFocus
                />
              ) : (
                <div
                  className="badge-qty-input-display"
                  onDoubleClick={() => handleBadgeDoubleClick("cement")}
                >
                  {badgeValues.cement}
                </div>
              )}
            </div>
            <img src={cement} className="cement" alt="cement" />
            {editingField === "cement" ? (
              <input
                type="number"
                name="cement"
                value={tempValue !== null ? tempValue : ""}
                onChange={handleMaterialInputChange}
                onBlur={handleMaterialInputBlur}
                className="Material-cement-edit"
                autoFocus
              />
            ) : (
              <div
                className="Material-cement-input"
                onDoubleClick={() => handleMaterialDoubleClick("cement")}
              >
                {ppeValues.cement}
              </div>
            )}
          </div>

          {/* Brick */}
          <div className="Material-brick" style={{ position: "relative" }}>
            <h3 className="Material-title">Brick</h3>
            <div className="Material-top-right">
              <img src={badgeIcon} alt="Badge" className="badge-icon" />
              {badgeEditingField === "brick" ? (
                <input
                  type="number"
                  value={badgeTempValue !== null ? badgeTempValue : ""}
                  onChange={handleBadgeInputChange}
                  onBlur={handleBadgeInputBlur}
                  className="badge-qty-input"
                  autoFocus
                />
              ) : (
                <div
                  className="badge-qty-input-display"
                  onDoubleClick={() => handleBadgeDoubleClick("brick")}
                >
                  {badgeValues.brick}
                </div>
              )}
            </div>
            <img src={brick} className="brick" alt="brick" />
            {editingField === "brick" ? (
              <input
                type="number"
                name="brick"
                value={tempValue !== null ? tempValue : ""}
                onChange={handleMaterialInputChange}
                onBlur={handleMaterialInputBlur}
                className="Material-brick-edit"
                autoFocus
              />
            ) : (
              <div
                className="Material-brick-input"
                onDoubleClick={() => handleMaterialDoubleClick("brick")}
              >
                {ppeValues.brick}
              </div>
            )}
          </div>

          {/* Sand */}
          <div className="Material-sand" style={{ position: "relative" }}>
            <h3 className="Material-title">Sand</h3>
            <div className="Material-top-right">
              <img src={badgeIcon} alt="Badge" className="badge-icon" />
              {badgeEditingField === "sand" ? (
                <input
                  type="number"
                  value={badgeTempValue !== null ? badgeTempValue : ""}
                  onChange={handleBadgeInputChange}
                  onBlur={handleBadgeInputBlur}
                  className="badge-qty-input"
                  autoFocus
                />
              ) : (
                <div
                  className="badge-qty-input-display"
                  onDoubleClick={() => handleBadgeDoubleClick("sand")}
                >
                  {badgeValues.sand}
                </div>
              )}
            </div>
            <img src={sand} className="sand" alt="sand" />
            {editingField === "sand" ? (
              <input
                type="number"
                name="sand"
                value={tempValue !== null ? tempValue : ""}
                onChange={handleMaterialInputChange}
                onBlur={handleMaterialInputBlur}
                className="Material-sand-edit"
                autoFocus
              />
            ) : (
              <div
                className="Material-sand-input"
                onDoubleClick={() => handleMaterialDoubleClick("sand")}
              >
                {ppeValues.sand}
              </div>
            )}
          </div>

          {/* Steel */}
          <div className="Material-steel" style={{ position: "relative" }}>
            <h3 className="Material-title">Steel</h3>
            <div className="Material-top-right">
              <img src={badgeIcon} alt="Badge" className="badge-icon" />
              {badgeEditingField === "steel" ? (
                <input
                  type="number"
                  value={badgeTempValue !== null ? badgeTempValue : ""}
                  onChange={handleBadgeInputChange}
                  onBlur={handleBadgeInputBlur}
                  className="badge-qty-input"
                  autoFocus
                />
              ) : (
                <div
                  className="badge-qty-input-display"
                  onDoubleClick={() => handleBadgeDoubleClick("steel")}
                >
                  {badgeValues.steel}
                </div>
              )}
            </div>
            <img src={steel} className="steel" alt="steel" />
            {editingField === "steel" ? (
              <input
                type="number"
                name="steel"
                value={tempValue !== null ? tempValue : ""}
                onChange={handleMaterialInputChange}
                onBlur={handleMaterialInputBlur}
                className="Material-steel-edit"
                autoFocus
              />
            ) : (
              <div
                className="Material-steel-input"
                onDoubleClick={() => handleMaterialDoubleClick("steel")}
              >
                {ppeValues.steel}
              </div>
            )}
          </div>

          {/* Mixture */}
          <div className="Material-mixture" style={{ position: "relative" }}>
            <h3 className="Material-title">Mixture</h3>
            <div className="Material-top-right">
              <img src={badgeIcon} alt="Badge" className="badge-icon" />
              {badgeEditingField === "mixture" ? (
                <input
                  type="number"
                  value={badgeTempValue !== null ? badgeTempValue : ""}
                  onChange={handleBadgeInputChange}
                  onBlur={handleBadgeInputBlur}
                  className="badge-qty-input"
                  autoFocus
                />
              ) : (
                <div
                  className="badge-qty-input-display"
                  onDoubleClick={() => handleBadgeDoubleClick("mixture")}
                >
                  {badgeValues.mixture}
                </div>
              )}
            </div>
            <img src={mixture} className="mixture" alt="mixture" />
            {editingField === "mixture" ? (
              <input
                type="number"
                name="mixture"
                value={tempValue !== null ? tempValue : ""}
                onChange={handleMaterialInputChange}
                onBlur={handleMaterialInputBlur}
                className="Material-mixture-edit"
                autoFocus
              />
            ) : (
              <div
                className="Material-mixture-input"
                onDoubleClick={() => handleMaterialDoubleClick("mixture")}
              >
                {ppeValues.mixture}
              </div>
            )}
          </div>

          {/* Plumbing */}
          <div className="Material-plumbing" style={{ position: "relative",marginBottom:'50px' }}>
            <h3 className="Material-title">Plumbing</h3>
            <div className="Material-top-right">
              <img src={badgeIcon} alt="Badge" className="badge-icon" />
              {badgeEditingField === "plumbing" ? (
                <input
                  type="number"
                  value={badgeTempValue !== null ? badgeTempValue : ""}
                  onChange={handleBadgeInputChange}
                  onBlur={handleBadgeInputBlur}
                  className="badge-qty-input"
                  autoFocus
                />
              ) : (
                <div
                  className="badge-qty-input-display"
                  onDoubleClick={() => handleBadgeDoubleClick("plumbing")}
                >
                  {badgeValues.plumbing}
                </div>
              )}
            </div>
            <img src={plumbing} className="plumbing" alt="plumbing" />
            {editingField === "plumbing" ? (
              <input
                type="number"
                name="plumbing"
                value={tempValue !== null ? tempValue : ""}
                onChange={handleMaterialInputChange}
                onBlur={handleMaterialInputBlur}
                className="Material-plumbing-edit"
                autoFocus
              />
            ) : (
              <div
                className="Material-plumbing-input"
                onDoubleClick={() => handleMaterialDoubleClick("plumbing")}
              >
                {ppeValues.plumbing}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modal Overlay */}
      {showModal && (
  <div
    className="material-content-modal"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}
  >
    <div
      className="material-modall-content"
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        width: "400px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        position: "relative",
        color: "black",
      }}
    >
      <button
        className="material-closee-modal"
        onClick={() => setShowModal(false)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        &times;
      </button>
      <h2 style={{ textAlign: "center", marginBottom: "20px",color: "black" }}>
        Add New Material
      </h2>
      <form onSubmit={handleAddMaterial}>
        <div style={{ marginBottom: "15px"}}>
          <label style={{ display: "block", marginBottom: "5px",color: "black" }}>
            Material Name:
          </label>
          <input
            type="text"
            name="labelName"
            value={newMaterial.labelName}
            onChange={handleNewMaterialChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px",color: "black" }}>
            Total Quantity:
          </label>
          <input
            type="number"
            name="total"
            value={newMaterial.total}
            onChange={handleNewMaterialChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px",color: "black" }}>
            Used Quantity:
          </label>
          <input
            type="number"
            name="used"
            value={newMaterial.used}
            onChange={handleNewMaterialChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#007BFF",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Add Material
        </button>
      </form>
    </div>
  </div>
)}
    </div>
  );
}

export default Material;
