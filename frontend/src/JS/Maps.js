import React, { useEffect, useState, useRef } from "react";
import "../CSS/Maps.css";
import 'leaflet/dist/leaflet.css';
import SidePanel from "./SidePanel";
import logo from "../Images/Main-Logo.png";
import { FaSearch, FaHome, FaMapMarkerAlt, FaCheck } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { MdEdit } from "react-icons/md";
import mapimg from '../Images/maplocate.png';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// npm install react-leaflet-geosearch : for locator
// npm install leaflet react-leaflet

const customMarker = new L.Icon({
    iconUrl: mapimg,
    iconSize: [105, 70],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

function Maps() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [position, setPosition] = useState([13.0827, 80.2707]); // Default location: Chennai
    const [markers, setMarkers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [formPosition, setFormPosition] = useState(null); // Marker position
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        siteOwner: '',
        siteManager: '',
        siteStartDate: '',
        managerPhone: '',
        groundWidth: '',
        groundHeight: '',
    });
    const [mapData, setMapData] = useState([]);

    // For Username
  const location = useLocation();
  const email = location.state?.email || "Guest";
  // Extract username before '@'
  const username = email ? email.split("@")[0] : "User";

    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };

    useEffect(() => {
        localStorage.setItem('markers', JSON.stringify(markers));
    }, [markers]);

    // Fetch data from your API
    useEffect(() => {
        const fetchMapData = async () => {
            try {
                const response = await fetch('https://onsiteiq-server.onrender.com/api/get-map-data');
                const data = await response.json();
                setMapData(data);  // Store the API data
            } catch (error) {
                console.error("Error fetching map data:", error);
            }
        };

        fetchMapData();
    }, []);

    // Prepare markers for the map based on the API data
    useEffect(() => {
        if (mapData.length > 0) {
            const newMarkers = mapData.map((site) => ({
                position: [site.latitude, site.longitude], // Assuming you have these fields in your data
                formData: site,
            }));
            setMarkers(newMarkers);  // Update markers state
        }
    }, [mapData]);



    // Handle search input change and perform search
    const handleSearch = async (query) => {
        if (!query) {
            setSearchResults([]);  // Clear results if query is empty
            return;
        }
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=in`);
        const results = await response.json();

        if (results.length > 0) {
            setSearchResults(results);  // Store results in state
            const { lat, lon } = results[0];  // Get the first result's coordinates
            setPosition([parseFloat(lat), parseFloat(lon)]);  // Update map position with coordinates
        } else {
            setSearchResults([]);  // Clear results if no results found
        }
    };
    // Handle suggestion click, update position
    const handleSuggestionClick = (lat, lon, address) => {
        setPosition([lat, lon]);
        setSearchQuery(address);
        setSearchResults([]);
    };

    // Map event to capture map clicks
    const MapEvents = () => {
        const map = useMap();
        useMapEvents({
            dblclick: (e) => {
                const { lat, lng } = e.latlng;
                setFormPosition([lat, lng]);
            },
        });
        return null;
    };

    useEffect(() => {
        const savedMarkers = localStorage.getItem('markers');
        if (savedMarkers) {
            try {
                setMarkers(JSON.parse(savedMarkers));
            } catch (error) {
                console.error('Error loading markers from localStorage:', error);
            }
        }
    }, []);
    
    // Delete a marker
    // const deleteMarker = (index) => {
    //     if (window.confirm("Are you sure you want to delete this marker?")) {
    //         const newMarkers = markers.filter((_, i) => i !== index);
    //         setMarkers(newMarkers);
    //         localStorage.setItem('markers', JSON.stringify(newMarkers));
    //     }
    // };
    // const deleteMarker = async (index, markerId) => {
    //     console.log("Markerrr ID:", markerId); // Check if markerId is being passed correctly
    //     console.log("index",index)
    
    //     if (window.confirm("Are you sure you want to delete this marker?")) {
    //         try {
    //             const response = await fetch(`https://onsiteiq-server.onrender.com/api/delete-map-data/${markerId}`, {
    //                 method: 'DELETE',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //             });
    
    //             if (!response.ok) {
    //                 throw new Error('Failed to delete marker from backend');
    //             }
    
    //             const newMarkers = markers.filter((_, i) => i !== index);
    //             setMarkers(newMarkers);
    //             localStorage.setItem('markers', JSON.stringify(newMarkers));
    //             alert('Marker deleted successfully');
    //         } catch (error) {
    //             console.error('Error deleting marker:', error);
    //             alert('Failed to delete marker');
    //         }
    //     }
    // hh
    // };
    //jh
    

    const deleteMarker = async (index, markerId) => {
        console.log("Deleting marker with ID:", markerId);
    
        if (window.confirm("Are you sure you want to delete this marker?")) {
            try {
                const response = await fetch(`https://onsiteiq-image-server.onrender.com/api/delete-map-data/${markerId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    const error = await response.json();
                    console.error("Backend error response:", error);
                    throw new Error(error.message || 'Failed to delete marker');
                }
    
                console.log("Marker deleted successfully:", markerId);
                const newMarkers = markers.filter((_, i) => i !== index);
                setMarkers(newMarkers);
                localStorage.setItem('markers', JSON.stringify(newMarkers));
                alert('Marker deleted successfully');
            } catch (error) {
                console.error('Error deleting marker:', error);
                alert(`Failed to delete marker: ${error.message}`);
            }
        }
    };        
    
    // const deleteMarker = (index) => {
    //     const newMarkers = markers.filter((_, i) => i !== index);
    //     setMarkers(newMarkers);
    //     localStorage.setItem('markers', JSON.stringify(newMarkers)); // Persist the change in localStorage
    // };

    // Load markers from localStorage on page load
    useEffect(() => {
        const savedMarkers = localStorage.getItem('markers');
        if (savedMarkers) {
            setMarkers(JSON.parse(savedMarkers)); // Load saved markers into state
        }
    }, []);

    // Handle Submit
    const handleMapClick = (e) => {
        const { lat, lng } = e.latlng; // Get lat/lng when map is clicked
        setFormPosition([lat, lng]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formPosition) {
            alert("Please click on the map to set the position.");
            return;
        }

        try {
            // Combine form data with latitude and longitude from map click
            const dataToSubmit = {
                ...formData,
                latitude: formPosition[0],
                longitude: formPosition[1],
            };

            const response = await fetch("https://onsiteiq-server.onrender.com/add-marker", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSubmit),
            });

            const result = await response.json();
            if (response.ok) {
                console.log(result);
                alert("Marker submitted successfully!");
                setFormData({
                    siteOwner: '',
                    siteManager: '',
                    siteStartDate: '',
                    managerPhone: '',
                    groundWidth: '',
                    groundHeight: '',
                });
                setFormPosition(null); // Reset position after submission
                // Reload the page to fetch and display new markers
                window.location.reload();
            } else {
                alert(result.message || "Error submitting marker. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error submitting marker. Please try again.");
        }
    };
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }; 
      

    return (
        <div className="MainScreens">
            <div className="MainScreen-Header">
                <img src={logo} className="Logo" alt="Logo" />
                <nav className="Top-Panel">
                    <ul className="ull">
                        <li onClick={() => navigate("/main")}>
                            <FaHome size={30} style={{ marginBottom: "-5px" }} /> Home
                        </li>
                        <li>
                            <FaMapMarkerAlt size={30} style={{ marginBottom: "-5px", marginRight: "5px" }} />
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
                            <RxAvatar size={30} style={{ marginTop: "-5px", marginLeft: "20px" }} />
                        </p>
                        <p onClick={toggleDropdown}>
                            <RiArrowDropDownLine
                                size={40}
                                style={{ marginTop: "-10px", marginRight: "10px" }}
                            />
                        </p>
                    </div>

                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                handleSearch(e.target.value);  // Trigger search on input change
                            }}
                        />
                        <button onClick={() => handleSearch(searchQuery)}>
                            <FaSearch size={20} />
                        </button>
                        {searchResults.length > 0 && (
                            <ul className="search-suggestions">
                                {searchResults.map((result, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSuggestionClick(result.lat, result.lon, result.display_name)}
                                    >
                                        {result.display_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </nav>
            </div>

            <div style={{marginTop:"110px"}}>
                <SidePanel />
            </div>

            <div style={{ height: '650px', width: '1200px', marginLeft: '310px', marginTop: '0px' }}>
                <MapContainer
                    center={position}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    whenCreated={(map) => map.on("click", handleMapClick)}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapEvents />

                    {markers.map((marker, index) => (
                        <Marker key={index} position={marker.position} icon={customMarker}>
                            <Popup>
                                <div
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                        background: "#f0f0f0",
                                        paddingTop: "10px",
                                        width: "300px",
                                        borderRadius: "5px",
                                        border: "2px solid #ccc",
                                        textAlign: "center",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "left",
                                        justifyContent: "left",
                                        gap: "15px",
                                        backgroundColor: "rgba(24, 134, 21, 0.20)",  
                                        borderRadius: "10px",
                                        border: "1px solid #000000",
                                        backdropFilter: "blur(12.5px)", 
                                        justifyContent:'left'
                                    }}
                                >
                                    <img src={logo} style={{width:"160px",height:"60px",marginLeft:"70px"}} alt="Logo" />
                                    {/* <strong style={{color:"black",fontWeight:"bold",fontSize:"25px"}}>{marker.label}</strong> */}
                                    <div style={{color:"black"}}>
                                        <strong style={{color:"black",fontSize:"20px"}}>Site Owner: </strong>{marker.formData.siteOwner}
                                    </div>
                                    <div style={{color:"black"}}>
                                        <strong style={{color:"black",fontSize:"20px"}}>Site Manager: </strong>{marker.formData.siteManager}
                                    </div>
                                    <div style={{color:"black"}}>
                                        <strong style={{color:"black",fontSize:"20px"}}>Start Date: </strong>{marker.formData.siteStartDate}
                                    </div>
                                    <div style={{color:"black"}}>
                                        <strong style={{color:"black",fontSize:"20px"}}>Manager Phone: </strong>{marker.formData.managerPhone}
                                    </div>
                                    <div style={{color:"black"}}>
                                        <strong style={{color:"black",fontSize:"20px"}}>Ground Width: </strong>{marker.formData.groundWidth}
                                    </div>
                                    <div style={{color:"black"}}>
                                        <strong style={{color:"black",fontSize:"20px"}}>Ground Height: </strong>{marker.formData.groundHeight}
                                    </div>
                                    <button
                                        onClick={() =>{
                                            // console.log("Markers array:", markers);
                                            console.log("Marker ID in deleteMrrrarker:", marker.formData._id);
                                             deleteMarker(index,marker.formData._id)}}
                                        style={{
                                            color: 'green',
                                            background: 'transparent',
                                            border: '2px solid black',
                                            borderColor: 'green',
                                            padding: '5px 10px',
                                            width: 'fit-content',
                                            marginLeft: '60px',
                                            marginBottom: '10px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <FaCheck size={20} style={{fill: 'red'}} /> Click if the work is done
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {formPosition && (
                        <Marker position={formPosition} icon={customMarker}>
                            <Popup>
                                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                    <div>
                                        <label style={{color:"black",fontWeight:"bold",marginRight:"10px"}}>Site Owner:</label>
                                        <input style={{color:"black",border:'1px solid black'}}
                                            type="text"
                                            value={formData.siteOwner}
                                            onChange={(e) =>
                                                setFormData({ ...formData, siteOwner: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label style={{color:"black",fontWeight:"bold",marginRight:"10px"}}>Site Manager:</label>
                                        <input style={{color:"black",border:'1px solid black'}}
                                            type="text"
                                            value={formData.siteManager}
                                            onChange={(e) =>
                                                setFormData({ ...formData, siteManager: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label style={{color:"black",fontWeight:"bold",marginRight:"10px"}}>Start Date:</label>
                                        <input style={{color:"black",border:'1px solid black'}}
                                            type="date"
                                            value={formData.siteStartDate}
                                            onChange={(e) =>
                                                setFormData({ ...formData, siteStartDate: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label style={{color:"black",fontWeight:"bold",marginRight:"10px"}}>Manager Phone:</label>
                                        <input style={{color:"black",border:'1px solid black'}}
                                            type="text"
                                            value={formData.managerPhone}
                                            onChange={(e) =>
                                                setFormData({ ...formData, managerPhone: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label style={{color:"black",fontWeight:"bold",marginRight:"10px"}}>Ground Width:</label>
                                        <input style={{color:"black",border:'1px solid black'}}
                                            type="text"
                                            value={formData.groundWidth}
                                            onChange={(e) =>
                                                setFormData({ ...formData, groundWidth: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label style={{color:"black",fontWeight:"bold",marginRight:"10px"}}>Ground Height:</label>
                                        <input style={{color:"black",border:'1px solid black'}}
                                            type="text"
                                            value={formData.groundHeight}
                                            onChange={(e) =>
                                                setFormData({ ...formData, groundHeight: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div style={{ color: "black" }}>
                                        <strong style={{ color: "black", fontSize: "20px" }}>Latitude: </strong>{formPosition[0]}
                                    </div>
                                    <div style={{ color: "black" }}>
                                        <strong style={{ color: "black", fontSize: "20px" }}>Longitude: </strong>{formPosition[1]}
                                    </div>
                                    <button style={{backgroundColor:"green",borderRadius:"10px",color:"white",padding:"10px"}}
                                    type="submit">Add Marker</button>
                                </form>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>           

            {/* Dropdown menu */}
     {isDropdownOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100px', // Adjust based on your design
            right: '315px',
            background: "rgba(255, 255, 255, 0.2)", // Semi-transparent white background
            backdropFilter: "blur(10px)", // Applies the blur effect
            WebkitBackdropFilter: "blur(10px)", 
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '10px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p><RxAvatar size={30}className='drop-avatar'/></p>
          <MdEdit style={{marginTop:"-80px",marginLeft:"150px",cursor:"pointer"}} />
          </div>

          <p
            style={{
              margin: '0',
              marginTop:'50px',
              padding: '5px 10px',
              cursor: 'pointer',
              color:'green',
              fontWeight:"bold"
            }}
          >
            {username}@onsiteiq.org.in
          </p>
          <hr style={{ border: "1px solid black", margin: "20px 0" }} />
          <button
            style={{
              display: 'block',
              margin: '10px auto',
              padding: '5px 15px',
              backgroundColor: '#007BFF',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={() => navigate("/Contract", { state: { email } })}
          >
            Contact
          </button>
        </div>
      )}   

        </div>
    );
}

export default Maps;
