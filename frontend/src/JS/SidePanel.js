import React, { useEffect,useState } from 'react';
import '../CSS/SidePanel.css';
import imgclimate from '../Images/rainey.png';
import temp from '../Images/temp.png';
import { FaLocationDot } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { Navigate,useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { 
    FaBell, 
    FaBuilding, 
    FaUsers, 
    FaCalculator, 
    FaShieldAlt, 
    FaInfoCircle, 
    FaSignOutAlt,
    FaCloud,
  } from 'react-icons/fa';
  
  

const SidePanel = ({}) => {
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [error, setError] = useState(null);
    const API_KEY = "e1210a9614c2de5afd35325956890194";
    const [weather, setWeather] = useState(null);
    const navigate = useNavigate();
    // For Username
      const locations = useLocation();
      const email = locations.state?.email || "Guest";

    useEffect(() => {
      // Get user's current location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
  
          // Fetch weather data
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
          )
            .then((response) => response.json())
            .then((data) => {
              console.log("Weather API Response:", data); // Debug the response
              setWeather(data);
            })
            .catch((err) => setError("Failed to fetch weather data."));
        },
        (err) => {
          console.error("Error fetching location:", err);
          setError("Failed to get location. Please enable location services.");
        }
      );
    }, [API_KEY]); // Dependency array ensures this runs once with the API key
   // Empty dependency array ensures it runs only once on component mount

   
  
  return (
    <div className="sidepanel">
      <div className='sub-sidepanel'>
        {error && <p>{error}</p>}
        {weather ? (
          <div
            className="weather"
            style={{
              border: "2px solid white",
              borderRadius: "25px",
              padding: "10px",
              margin: "10px",
              width: "255px",
              height: "200px",
            }}
          >
            <img
              src={temp}
              alt="Weather Icon"
              style={{ width: "30px", height: "40px", marginTop: "10px", marginRight: "130px" }}
            />
            <p
              style={{
                fontSize: "35px",
                fontWeight: "bold",
                marginTop: "-45px",
                marginLeft: "50px",
              }}
            >
              {weather.main?.temp !== undefined ? `${weather.main.temp}°C` : "N/A"}
            </p>
            <img
              src={imgclimate}
              alt="Weather Icon"
              style={{ width: "60px", height: "45px", marginTop: "-20px" }}
            />
            <p>Condition: {weather.weather?.[0]?.description || "N/A"}</p>
            <h2 style={{ marginTop: "-5px",marginLeft: "10px" }}>
              <FaLocationDot /> {weather.name || "Unknown Location"}
            </h2>
          </div>
        ) : (
          !error && <p>Loading...</p>
        )}
      </div>
    

      <div className="sub-sidepanel1">
        <nav>
          <ul className='ulls'>
            <li onClick={() => navigate("/Dashboard", { state: { email } })}><RxDashboard /> Dashboard </li>
            <li onClick={() => navigate("/alert", { state: { email } })}><FaBell /> Alert</li>
            <li onClick={() => navigate("/CreatingConstruction",{ state: { email } })}><FaBuilding /> View Sites </li>
            <li onClick={() => navigate("/Members",{ state: { email } })}><FaUsers /> Members</li>
            <li onClick={() => navigate("/estimationForm",{ state: { email } })}><FaCalculator /> Estimation </li>
            <li onClick={() => navigate("/safety",{ state: { email } })}> <FaShieldAlt /> Safety </li>
            <li onClick={() => navigate("/Aboutus",{ state: { email } })}><FaInfoCircle /> About Us </li>
          </ul>
        </nav>
        <button style={{backgroundColor: "transparent",padding:"15px",border: 'none',fontSize:'18px',marginLeft:"50px",marginTop:"5px", top:"0px"}}
        onClick={() => navigate("/home")}>
          <MdLogout size={20} style={{fill: "red",marginLeft:"5px" }} /> 
          Logout
          </button>
      </div>


    </div>
  );
};

export default SidePanel;
