import React, { useState } from "react";
import "../CSS/Register.css";
import logo from "../Images/Main-Logo.png";
import screenvideo from "../Images/LoginVideo.mp4";
import { useNavigate } from "react-router-dom"; // Import useNavigate at the top

function Register() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTPBoxes, setShowOTPBoxes] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill("")); // Array for 6 input fields
  const navigate = useNavigate(); // **Move useNavigate hook here**

  // Generate random OTP (first and second)
  const generateOTP = () => Math.random().toString(36).substr(2, 6).toUpperCase();

  const handleVerifyClick = () => {
    setError("");
    setLoading(true);

    // Simulate email validation
    setTimeout(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setLoading(false);
        setError("Please enter a valid email.");
        return;
      }

      // On successful validation, show OTP boxes and stop loading
      const otp = generateOTP();
      console.log("First OTP sent to email:", otp); // Simulate OTP sending
      setShowOTPBoxes(true);
      setLoading(false);
    }, 2000); // Simulate a 2-second delay
  };

  const handleVerifyClicks = async () => {
    // Regular expression for validating email pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    // Check if the email matches the pattern
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return; // Exit if email is invalid
    }
  
    setLoading(true);
    try {
      // Step 1: Fetch the registered emails from the server
      const registeredEmailsResponse = await fetch("http://localhost:5000/get-registered-emails");
      const registeredEmailsData = await registeredEmailsResponse.json();
  
      // Step 2: Check if the response is successful and if the email is in the registered list
      if (!registeredEmailsResponse.ok) {
        alert("Error fetching registered emails. Please try again.");
        return;
      }
  
      // Step 3: Extract emails from the response and check if the email already exists
      const registeredEmails = registeredEmailsData.emails.map(item => item.email); // Extracting emails from the response
  
      if (registeredEmails.includes(email)) {
        alert("Email is already registered.");
        return; // Stop the process if the email is already registered
      }
  
      // Step 4: Store the registration attempt before sending OTP
      const storeResponse = await fetch("http://localhost:5000/store-registration-attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const storeData = await storeResponse.json();
  
      if (!storeData.success) {
        alert(storeData.message); // Handle storing attempt failure
        return;
      }
  
      // Step 5: Call the send-otp API
      const otpResponse = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const otpData = await otpResponse.json();
  
      if (otpResponse.status === 409) {
        // Email already exists in the send-otp API logic (check another layer)
        alert(otpData.message);
      } else if (otpResponse.ok) {
        // OTP sent successfully
        alert("OTP sent to your email!");
        setShowOTPBoxes(true); // Show OTP input boxes
      } else {
        alert(otpData.message); // Handle errors from OTP API
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      alert("Error sending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };
    
  

  const handleSubmitOTP = async () => {
    const otpString = otp.join(""); // Join array elements into a string
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString }),
      });
      const data = await response.json();
      if (data.success) {
        alert("OTP verified successfully! Check Your Email for Registration Confirmation.");

        // **Use navigate here to redirect after OTP verification**
        navigate('/Login', { state: { email } });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (element, index) => {
    const value = element.value;
    if (!isNaN(value) && value.length <= 1) { // Allow only numbers and single characters
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      // Automatically focus on the next input field
      if (element.nextSibling && value) {
        element.nextSibling.focus();
      }
    }
  };

  const handleBackspace = (element, index) => {
    if (element.previousSibling && otp[index] === "") {
      const updatedOtp = [...otp];
      updatedOtp[index - 1] = "";
      setOtp(updatedOtp);
      element.previousSibling.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const updatedOtp = new Array(6).fill("");
    pastedData.forEach((char, idx) => {
      if (!isNaN(char)) updatedOtp[idx] = char;
    });
    setOtp(updatedOtp);
  };

  return (
    <div className="Register">
      <div className="register-video-controls">
        <video autoPlay muted loop className="register-styled-videos">
          <source src={screenvideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="Register-form">
          <img src={logo} className="register-logo" alt="Logo" />
          <h2 className="register-title">Register</h2>
          <div className="register-detail">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                height: "25px",
                fontSize: "16px",
                width: "400px",
                textAlign: "left",
                border: "1px solid white",
                color: "white",
              }}
              placeholder="Enter your Email"
            />
            {!showOTPBoxes && (
              <button
                style={{
                  padding: "10px",
                  backgroundColor: loading ? "#0E2F06" : "green",
                  color: "white",
                  borderRadius: "5px",
                  marginLeft: "10px",
                  width: "150px",
                  fontSize: "18px",
                  cursor: "pointer",
                  letterSpacing: "2px",
                  fontFamily: "Saira",
                }}
                disabled={loading}
                onClick={handleVerifyClicks}
              >
                {loading ? (
                  <>
                    Verifying...{" "}
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "18px",
                        width: "30px",
                        height: "16px",
                        border: "2px solid white",
                        borderTop: "2px solid transparent",
                        borderRadius: "50%",
                        animation: "spin 2s linear infinite",
                      }}
                    ></span>
                  </>
                ) : (
                  "Verify"
                )}
              </button>
            )}
            <p style={{fontSize: "20px" ,color:'red',backgroundColor:'#d4cecd',border:'1px solid white',padding:'5px',borderRadius:'5px',marginLeft:'210px',cursor:'pointer',
            fontFamily: "Saira",width:'fit-content',fontWeight:'bold',
            }} onClick={() => navigate("/Login")}>Already have an account ?</p>
          </div>
          {error && (
            <p style={{ color: "red", marginTop: "10px", fontSize: "15px", fontWeight: "bold" }}>
              {error}
            </p>
          )}

          {/* Render OTP input boxes dynamically */}
          {showOTPBoxes && (
            <div
              className="otp-box-container"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {/* Label for OTP Input Boxes */}
              <label
                htmlFor="otp-inputs"
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginLeft: "-270px",
                  marginTop: "20px",
                  marginBottom: "10px",
                  fontFamily: "Saira",
                  color: "black",
                }}
              >
                Check Your Email for OTP:
              </label>

              {/* OTP Input Boxes */}
              <div
                id="otp-inputs"
                style={{
                  display: "flex",
                  gap: "10px",
                }}
                onPaste={handlePaste}
              >
                {otp.map((value, index) => (
                  <input
                    key={index}
                    value={value}
                    type="text"
                    maxLength="1"
                    style={{
                      width: "40px",
                      height: "40px",
                      textAlign: "center",
                      fontSize: "18px",
                      border: "2px solid black",
                      borderRadius: "5px",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                    onChange={(e) => handleChange(e.target, index)} // Handle value changes
                    onKeyDown={(e) =>
                      e.key === "Backspace" ? handleBackspace(e.target, index) : null
                    } // Handle backspace navigation
                  />
                ))}
              </div>

              {/* Submit Button for OTP */}
              <button
                style={{
                  marginTop: "20px",
                  padding: "10px",
                  backgroundColor: "green",
                  color: "white",
                  borderRadius: "5px",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
                onClick={handleSubmitOTP}
              >
                Submit OTP
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Spinner Animation Keyframes */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default Register;
