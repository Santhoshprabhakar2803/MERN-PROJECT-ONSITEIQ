import React, { useEffect, useState } from 'react';
import '../CSS/TopBar.css';
import logo from '../Images/Main-Logo.png';
import imgclimate from '../Images/rainey.png';
import temp from '../Images/temp.png';
import { FaSearch } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import { 
  FaBell, 
  FaBuilding, 
  FaUsers, 
  FaCalculator, 
  FaShieldAlt, 
  FaInfoCircle, 
} from 'react-icons/fa';

function TopBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const API_KEY = "e1210a9614c2de5afd35325956890194";
  const [weather, setWeather] = useState(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("Weather API Response:", data);
            setWeather(data);
          })
          .catch((err) => setError("Failed to fetch weather data."));
      },
      (err) => {
        console.error("Error fetching location:", err);
        setError("Failed to get location. Please enable location services.");
      }
    );
  }, [API_KEY]);

  return (
    <div className="topbar-container">
      <div className="topbar-header">
        <img src={logo} alt="Logo" className="logo" />
        <nav className="topbar-nav">
          <ul className="topbar-nav-list">
            <li className="topbar-nav-item"><FaHome size={30}/> Home</li>
            <li className="topbar-nav-item"><FaMapMarkerAlt size={30}/> Map</li>
          </ul>
          <div className="profile-dropdown">
            <RxAvatar size={30}/>
            <RiArrowDropDownLine size={40} onClick={toggleDropdown}/>
          </div>
          <div className="search-container">
            <input type="text" placeholder="Search..." className="search-input" />
            <button className="search-button"> <FaSearch /> </button>
          </div>
        </nav>
      </div>

      <div className="topbar-main">
        <div className="weather-container">
          {error && <p className="error">{error}</p>}
          {weather ? (
            <div className="weather-card">
              <img src={temp} alt="Weather Icon" className="weather-icon" />
              <p className="weather-temperature">
                {weather.main?.temp !== undefined ? `${weather.main.temp}°C` : "N/A"}
              </p>
              <img src={imgclimate} alt="Weather Icon" className="weather-icon" />
              <p className="weather-description">
                Condition: {weather.weather?.[0]?.description || "N/A"}
              </p>
              <h2 className="weather-location">
                <FaLocationDot /> {weather.name || "Unknown Location"}
              </h2>
            </div>
          ) : (
            !error && <p className="loading">Loading...</p>
          )}
        </div>

        <div className="sidebar-container">
          <nav className="sidebar-nav">
            <ul className="sidebar-nav-list">
              <li className="sidebar-nav-item"><FaHome/> Dashboard </li>
              <li className="sidebar-nav-item"><FaBell /> Alert</li>
              <li className="sidebar-nav-item"><FaBuilding /> View Sites </li>
              <li className="sidebar-nav-item"><FaUsers /> Members</li>
              <li className="sidebar-nav-item"><FaCalculator /> Estimation </li>
              <li className="sidebar-nav-item"><FaShieldAlt /> Safety </li>
              <li className="sidebar-nav-item"><FaInfoCircle /> About Us </li>
            </ul>
          </nav>
          <button className="logout-button">
            <MdLogout size={20} /> 
            Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        <h1 className="main-content-title">Welcome to Onsite<span style={{color:"#C75C27"}}>IQ</span> Building Construction Monitoring Site! We're thrilled to have you on board.</h1>
      </div>

      {isDropdownOpen && (
        <div className="dropdown-container">
          <div className="profile-card">
            <RxAvatar size={30}/>
            <MdEdit className="edit-icon" />
          </div>

          <p className="profile-email">
            example@mail.com
          </p>
          <hr className="dropdown-divider" />
          <button className="contact-button">
            Contact
          </button>
        </div>
      )}
    </div>
  );
}

export default TopBar;