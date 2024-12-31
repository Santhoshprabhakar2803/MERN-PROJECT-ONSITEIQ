import React, { useEffect, useState } from "react";
import "../CSS/Safety.css";
// import logo from "../src/Images/logo.jpg";
import Structure from "./Structure";
import shoes from "../Images/shoes.png";
import gloves from "../Images/gloves.png";
import vest from "../Images/vest.png";
import earmuffs from "../Images/earmuffs.png";
import mask from "../Images/mask.png";
import safetyglasses from "../Images/safety-glasses.png";
import fallprotection from "../Images/fall-protection.png";
import helmet from "../Images/helmet.png";
import yellowhelmet from "../Images/yellowhelmet.jpg";
import glasses1 from "../Images/glasses1.jpg";
import mask1 from "../Images/mask1.jpg";
import gloves1 from "../Images/gloves1.jpg";
import ppeimage from "../Images/ppeimage.jpg";
import lastcategoryimage from "../Images/last-category-image.png";

function Safety() {
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".MainScreen-Header");
      if (window.scrollY > 0) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // To get data from the backend
  const [ppeItems, setPpeItems] = useState([
    { key: "shoes", label: "Shoes", img: shoes },
    { key: "gloves", label: "Gloves", img: gloves },
    { key: "vest", label: "Vest", img: vest },
    { key: "earmuffs", label: "Earmuffs", img: earmuffs },
    { key: "mask", label: "Mask", img: mask },
    { key: "safetyglasses", label: "Safety Glasses", img: safetyglasses },
    { key: "fallprotection", label: "Fall Protection", img: fallprotection },
    { key: "helmet", label: "helmet", img: helmet },
  ]);

  // Fetch PPE data from the API
  const [ppeData, setPpeData] = useState([]); // State to store PPE data
  useEffect(() => {
    const fetchPPEData = async () => {
      try {
        const response = await fetch("http://localhost:5000/get-ppe"); // Replace with your backend URL
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPpeData(data);

        // Initialize PPE values with fetched data
        const initialValues = {};
        data.forEach((item) => {
          initialValues[item.label.toLowerCase().replace(" ", "")] = item.value;
        });
        setPpeValues(initialValues);
      } catch (error) {
        console.error("Error fetching PPE data:", error);
      }
    };

    fetchPPEData();
  }, []);


  // State for all PPE items
  const [ppeValues, setPpeValues] = useState({
    shoes: 0,
    gloves: 0,
    vest: 0,
    earmuffs: 0,
    mask: 0,
    safetyglasses: 0,
    fallprotection: 0,
    helmet: 0,
  });

  const [editingField, setEditingField] = useState(null);

  // Handle input changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setPpeValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    };

  // Handle exiting edit mode
  const handleInputBlur = async() => {
    await handleUpdate();
  };

  // Handle double-click to enter edit mode
  const handleDoubleClick = (field) => {
    setEditingField(field);
    console.log(`Editing field set to: ${field}`);
  };
  

  // Handle Update API
  const handleUpdate = async () => {
    console.log("Button clicked, updating field:", editingField);
    
    const value = ppeValues[editingField];
    console.log("Updated value:", value);
  
    // Check if the value is a valid number
    if (isNaN(value)) {
      console.error("Invalid value:", value);
      return;
    }
  
    alert("Please wait for a few seconds");
  
    // API request to update the value
    const response = await fetch(`http://localhost:5000/ppe/${editingField}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: Number(value) }),
    });
  
    const responseData = await response.json();
    console.log("API Response:", responseData);
  
    if (!response.ok) {
      alert(`Failed to update: ${responseData.error}`);
    } else {
      alert(`${editingField} updated successfully!`);
      setEditingField(null); // Exit edit mode after successful update
    }
  };
  
  return (
    <div className="PPE-MainScreens">       
      <div style={{ marginTop: "0px" }}>
        <Structure />
      </div>

      <div className="safety-main">
        <h1 className="safety-title">Safety (PPE)</h1>
        <div className="safety-content">
          {/* Shoes */}
          <div className="safety-shoes">
            <img src={shoes} className="shoes" alt="Shoes" />
            {editingField === "shoes" ? (
              <input
                type="number"
                name="shoes"
                value={ppeValues["shoes"] || 0}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="safety-shoes-edit"
                autoFocus
              />
            ) : (
              <div
                className="safety-shoes-input"
                onDoubleClick={() => handleDoubleClick("shoes")}
              >
                {ppeValues["shoes"]}
              </div>
            )}
          </div>

          {/* Gloves */}
          <div className="safety-gloves">
            <img src={gloves} className="gloves" alt="Gloves" />
            {editingField === "gloves" ? (
              <input
                type="number"
                name="gloves"
                value={ppeValues["gloves"]}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="safety-gloves-edit"
                autoFocus
              />
            ) : (
              <div
                className="safety-gloves-input"
                onDoubleClick={() => handleDoubleClick("gloves")}
              >
                {ppeValues["gloves"]}
              </div>
            )}
          </div>

          {/* Vest */}
          <div className="safety-vest">
            <img src={vest} className="vest" alt="Vest" />
            {editingField === "vest" ? (
              <input
                type="number"
                name="vest"
                value={ppeValues["vest"]}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="safety-vest-edit"
                autoFocus
              />
            ) : (
              <div
                className="safety-vest-input"
                onDoubleClick={() => handleDoubleClick("vest")}
              >
                {ppeValues["vest"]}
              </div>
            )}
          </div>

          {/* Earmuffs */}
          <div className="safety-earmuffs">
            <img src={earmuffs} className="earmuffs" alt="Earmuffs" />
            {editingField === "earmuffs" ? (
              <input
                type="number"
                name="earmuffs"
                value={ppeValues["earmuffs"]}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="safety-earmuffs-edit"
                autoFocus
              />
            ) : (
              <div
                className="safety-earmuffs-input"
                onDoubleClick={() => handleDoubleClick("earmuffs")}
              >
                {ppeValues["earmuffs"]}
              </div>
            )}
          </div>

          {/* Mask */}
          <div className="safety-mask">
            <img src={mask} className="mask" alt="Mask" />
            {editingField === "mask" ? (
              <input
                type="number"
                name="mask"
                value={ppeValues["mask"]}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="safety-mask-edit"
                autoFocus
              />
            ) : (
              <div
                className="safety-mask-input"
                onDoubleClick={() => handleDoubleClick("mask")}
              >
                {ppeValues["mask"]}
              </div>
            )}
          </div>

          {/* Safety Glasses */}
          <div className="safety-safetyglasses">
            <img src={safetyglasses} className="safetyglasses" alt="Safety Glasses" />
            {editingField === "safetyglasses" ? (
              <input
                type="number"
                name="safetyglasses"
                value={ppeValues["safetyglasses"]}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="safety-safetyglasses-edit"
                autoFocus
              />
            ) : (
              <div
                className="safety-safetyglasses-input"
                onDoubleClick={() => handleDoubleClick("safetyglasses")}
              >
                {ppeValues["safetyglasses"]}
              </div>
            )}
          </div>

          {/* Fall Protection */}
          <div className="safety-fallprotection">
            <img src={fallprotection} className="fallprotection" alt="Fall Protection" />
            {editingField === "fallprotection" ? (
              <input
                type="number"
                name="fallprotection"
                value={ppeValues["fallprotection"]}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="safety-fallprotection-edit"
                autoFocus
              />
            ) : (
              <div
                className="safety-fallprotection-input"
                onDoubleClick={() => handleDoubleClick("fallprotection")}
              >
                {ppeValues["fallprotection"]}
              </div>
            )}
          </div>

          {/* Helmet */}
          <div className="safety-helmet">
            <img src={helmet} className="helmet" alt="Helmet" />
            {editingField === "helmet" ? (
              <input
                type="number"
                name="helmet"
                value={ppeValues["helmet"]}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="safety-helmet-edit"
                autoFocus
              />
            ) : (
              <div
                className="safety-helmet-input"
                onDoubleClick={() => handleDoubleClick("helmet")}
              >
                {ppeValues["helmet"]}
              </div>
            )}
          </div>
</div>


        < div className="safety-content2">
        <h1>Understanding Personal Protective Equipment (PPE)</h1>
        <p className="ppe-description">Personal Protective Equipment (PPE) is essential in construction to ensure the safety and health of workers. It includes various types of gear designed to protect against specific hazards, ensuring a safer work environment.</p>
        <p className="ppe-description">Proper usage of PPE can significantly reduce the risk of injury and improve overall safety standards on the job site. It is crucial for workers to be trained on the correct use of PPE to maximize its effectiveness.</p>
        <img src={ppeimage} className="ppe-image" alt="ppeimage" />
        <h1>Personal Protective Equipment & its Categories</h1>
        <div className="ppe-categories1">
          <div className="ppe-category">
          <div className="helmet-card-text">
        <h2 className="helmet-title">Safety Helmets</h2>
        <p className="helmet-description">
          Safety helmets protect against head injuries in construction.</p>
      </div>
      <div className="helmet-card-image">
        <img src={yellowhelmet} alt="Safety Helmet" />
      </div>
            </div>
            <div className="ppe-category">
          <div className="helmet-card-text">
        <h2 className="helmet-title">Safety Gloves</h2>
        <p className="helmet-description">
        Safety gloves provide protection against cuts and abrasions.
        </p>
      </div>
      <div className="helmet-card-image">
        <img src={gloves1} alt="Safety Helmet" />
      </div>
            </div>

        </div>
        </div>
        <div className="ppe-categories2">
          <div className="ppe-category">
          <div className="helmet-card-text">
        <h2 className="helmet-title">Face Masks</h2>
        <p className="helmet-description">
        Face masks protect against airborne particles..</p>
      </div>
      <div className="helmet-card-image">
        <img src={mask1} alt="Safety Helmet" />
      </div>
            </div>
            <div className="ppe-category">
          <div className="helmet-card-text">
        <h2 className="helmet-title">Safety Goggles</h2>
        <p className="helmet-description">
        Safety goggles shield the eyes from hazardous materials.
        </p>
      </div>
      <div className="helmet-card-image">
        <img src={glasses1} alt="Safety Helmet" />
      </div>
            </div>
        </div>
        <span className="safety-line">
        Category 1: Helmets - Essential for head protection in various industries.
        <br/>
        Category 2: Gloves - Protect hands from cuts, chemicals, and temperature extremes.
        <br/>
        Category 3: Safety Glasses - Provide eye protection from debris and harmful substances.
        <br/>
        Category 4: Earplugs - Protect ears from high noise levels in industrial settings.
        <br/>
        Category 5: Respirators - Ensure clean air supply in contaminated environments.
        </span>
        <h1 className="disclaimer-title">Disclaimer: It is imperative to wear all Personal Protective Equipment (PPE) correctly at all times during construction activities to prevent serious injury.</h1>

        <div className="last-category">
        <div className="last-category-text">
        <p className="last-category-description">
        For further assistance and support, please contact: Safety Officer: Mr. John Doe 
        </p>
        <p className="last-category-email">
        Email: OnsiteiQConstruction@onsitiq.org.in.
        </p>
        <p className="last-category-phone">
        Phone: +123-456-7890
        </p>
      </div>
      <div className="last-category-image">
        <img src={lastcategoryimage} alt="Safety Helmet" />
      </div>

        </div>
        </div>
      </div>

  );
}

export default Safety;
