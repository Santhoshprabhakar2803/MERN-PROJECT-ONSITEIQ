import React, { useState, useEffect,useRef } from "react";
import "../CSS/SplashScreen.css";
import SpashVideo from '../Images/Splash Screen Video .mp4';
import { useNavigate } from "react-router-dom"; 


function SplashScreen() {
    const navigate = useNavigate();  // Initialize the navigate function

  useEffect(() => {
    // Set a timer to navigate after 5 seconds
    const timer = setTimeout(() => {
      navigate("/home");  // Change "/home" to your actual route for HomeScreen
    }, 5000);  // 5000 milliseconds = 5 seconds

    // Clear the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div className="SplashScreen">
      <video autoPlay loop muted>
        <source src={SpashVideo} type="video/mp4" />
      </video>
    </div>
  );
}

export default SplashScreen;
