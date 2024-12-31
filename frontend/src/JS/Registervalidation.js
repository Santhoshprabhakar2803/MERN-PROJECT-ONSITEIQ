import React, { useState,useEffect } from "react";
import { useLocation } from "react-router-dom";
import Structure from "./Structure";
import '../CSS/RegisterValidation.css';

function RegisterValidation() {
  const [attempts, setAttempts] = useState([]);
  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await fetch("https://onsiteiq-server.onrender.com/get-registration-attempts"); // Replace with your backend URL
        const data = await response.json();
        if (data.success) {
          setAttempts(data.attempts);
        }
      } catch (error) {
        console.error("Error fetching registration attempts:", error);
      }
    };

    fetchAttempts();
  }, []);

  // Registration Allow
  const allowRegistration = async (email) => {
    const organization = "OnsiteIQ"; // Replace with the actual organization name
    try {
      const response = await fetch("https://onsiteiq-server.onrender.com/allow-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
  
      if (data.success) {
        alert(`Registration for ${email} approved! Login details sent to the user.`);
        // Optionally, remove the user from the attempts list after approval
        setAttempts(attempts.filter((attempt) => attempt.email !== email));
      } else {
        alert("Failed to approve registration. Please try again.");
      }
    } catch (error) {
      console.error("Error approving registration:", error);
    }
  };
  

  // Deny the registration attempt
  const denyRegistration = async (email) => {
    try {
      const response = await fetch("https://onsiteiq-server.onrender.com/update-registration-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, status: "denied" }),
      });
      const data = await response.json();
  
      console.log(data); // Log the response to check if it's correct
  
      if (data.success) {
        alert(`Registration for ${email} denied.`);
        setAttempts((prevAttempts) =>
          prevAttempts.filter((attempt) => attempt.email !== email)
        );
      } else {
        alert("Failed to deny registration. Please try again.");
      }
    } catch (error) {
      console.error("Error denying registration:", error);
    }
  };
  


  return (
    <div className="Main-validation">
      <div className="validation-structure">
        <Structure />
      </div>
      <h1 style={{marginLeft:'310px'}}>Validate Your Workers Registration</h1>

        
      {attempts.map((attempt) => (
        <div className="validation-info" key={attempt._id}>
          <strong>Email:</strong>{" "}
          <span style={{ color: "green", fontSize: "24px" }}>
            {attempt.email}
          </span>
          <p>
            <strong>Date and Time:</strong>{" "}
            {`${attempt.attemptDate} ${attempt.attemptTime}`}
          </p>
          <strong>The User: </strong>{" "}
          <span style={{ color: "red", fontSize: "20px" }}>
            {attempt.email}
          </span>
          <strong> has tried to register into the website.</strong>
          <div style={{ marginTop: "20px" }}>
            <button
              style={{ marginRight: "20px", backgroundColor: "green" }}
              onClick={() => allowRegistration(attempt.email)}>
              Allow Registration
            </button>
            <button style={{ backgroundColor: "red" }}
            onClick={() => denyRegistration(attempt.email)}>
            Deny Registration</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RegisterValidation;
