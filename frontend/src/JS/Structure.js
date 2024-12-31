import React, { useEffect, useState } from "react";
import "../CSS/MainScreen.css";
import SidePanel from "./SidePanel";
import logo from "../Images/Main-Logo.png";
import { FaSearch } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RiAdminFill } from "react-icons/ri";


function Estimation({}) {
  // For Username
  const location = useLocation();
  const email = location.state?.email || "Guest";
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  // Extract username before '@'
  const username = email ? email.split("@")[0] : "User";

  // For Drop-Down
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };
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

    const handleDoubleTap = () => {
      navigate('/password')
    };
  

    const navigate = useNavigate();
    const navmap = () => {
      navigate("/Maps", { state: { email } });
    }

  return (
    <div className="MainScreens">
      <div className="MainScreen-Header">
        <img src={logo} className="Logo" alt="Logo" />
        <nav className="Top-Panel">
          <ul className="ull">
            <li onClick={() => navigate("/main")}>
              <FaHome size={30} style={{ marginBottom: "-5px" }} /> Home
            </li>
            <li onClick={navmap}>
              <FaMapMarkerAlt
                size={30}
                style={{ marginBottom: "-5px", marginRight: "5px" }}
              />
              Map
            </li>
          </ul>
          <div
            className="Main-dropdown"
            style={{
              display: "flex",
              flexDirection: "row",
              border: "0.5px solid white",
              width: "100px",
              height: "50px",
              justifyContent: "center",
              padding: "5px",
              gap: "5px",
              borderRadius: "20px",
            }}
          >
            <p>
              <RxAvatar
                size={30}
                style={{ marginTop: "-5px", marginLeft: "20px" }}
              />
            </p>
            <p onClick={toggleDropdown}>
              <RiArrowDropDownLine
                size={40}
                style={{ marginTop: "-10px", marginRight: "10px" }}
              />
            </p>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <button>
              {" "}
              <FaSearch />{" "}
            </button>
          </div>
        </nav>
      </div>

      <div style={{marginTop:"110px"}}>
        <SidePanel />
      </div>

      {/* this where you need to add you div block */}

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div
          style={{
            position: "absolute",
            top: "100px", // Adjust based on your design
            right: "315px",
            background: "rgba(255, 255, 255, 0.2)", // Semi-transparent white background
            backdropFilter: "blur(10px)", // Applies the blur effect
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: "1000",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <p>
              <RxAvatar size={30} className="drop-avatar"  />
            </p>

            <button onClick={handleDoubleTap}
            style={{
                marginTop: "-80px",
                marginLeft: "150px",
                backgroundColor:'transparent',
                padding: "5px",}}><RiAdminFill fill="black" size={22}/>
            </button>
            
          </div>

          <p
            style={{
              margin: "0",
              marginTop: "50px",
              padding: "5px 10px",
              cursor: "pointer",
              color: "black",
              fontWeight: "bold",
              color: "#4CAF50"
            }}
          >
           {username}@onsiteiq.org.in
          </p>
          <hr style={{ border: "1px solid black", margin: "20px 0" }} />
          <button
            style={{
              display: "block",
              margin: "10px auto",
              padding: "5px 15px",
              backgroundColor: "#007BFF",
              color: "black",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/Contract",{ state: { email } })}
          >
            Contact
          </button>
        </div>
      )}
    </div>
  );
}

export default Estimation;
