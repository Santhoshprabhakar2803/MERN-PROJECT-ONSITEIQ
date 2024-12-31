import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Login.css";
import logo from "../Images/Main-Logo.png";
import screenvideo from "../Images/LoginVideo.mp4";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setError("Please enter your email.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/get-personal-login-details");
      const data = await response.json();
  
      if (response.ok && data.success) {
        // Change 'orgEmail' to 'email' here
        const user = data.loginDetails.find(user => user.email === forgotEmail);
  
        if (!user) {
          setError("This email is not registered. Please check your email.");
          return;
        }
  
        const otpResponse = await fetch("http://localhost:5000/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        });
        const otpData = await otpResponse.json();
  
        if (otpResponse.ok && otpData.success) {
          alert("OTP sent to your email.");
          setOtpSent(true);
        } else {
          setError(otpData.message || "Error sending OTP.");
        }
      } else {
        setError(data.message || "Error fetching user details.");
      }
    } catch (error) {
      console.error("Error during forgot password:", error);
      setError("Error processing request. Please try again.");
    }
  };
  

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setOtpVerified(true);
        setOtpError("");
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("An error occurred. Please try again.");
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, newPassword }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPasswordUpdated(true);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || "Failed to update password. Please try again.");
      }
    } catch (err) {
      console.error("Error during password update:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/get-login-details");
      const data = await response.json();

      if (response.ok && data.success) {
        const isValidUser = data.loginDetails.some(
          (user) => user.orgEmail === email && user.password === password
        );

        if (isValidUser) {
          navigate("/Main", { state: { email } });
        } else {
          setError("Invalid email or password. Please try again.");
        }
      } else {
        setError("Failed to fetch login details. Please try again later.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Login">
      <div className="login-video-controls">
        <video autoPlay muted loop className="login-styled-videos">
          <source src={screenvideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="Login-form">
          <img src={logo} className="login-logo" alt="Logo" />
          <h2 className="login-title">Login</h2>
          <div className="login-detail">
            <div style={{ display: "flex", flexDirection: "column",gap: "15px" }}>
            <input
              type="email"
              style={{
                height: "25px",
                fontSize: "16px",
                width: "400px",
                textAlign: "left",
                border:'1px solid white',
                color:'black'
              }}
              placeholder="Enter your Organization Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              style={{
                height: "25px",
                fontSize: "16px",
                width: "400px",
                textAlign: "left",
                border:'1px solid white',
                color:'black'
              }}
              placeholder="Enter your Organization Password"
              value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            <p
              onClick={() => setShowModal(true)}
              style={{
                color: "white",
                cursor: "pointer",
                fontSize: "18px",
                textAlign: "right",
                marginLeft: "280px",
                marginTop: "-5px",
              }}
            >
              Forgot Password?
            </p>
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                fontSize: "20px",
                backgroundColor: "green",
                padding: "10px",
                borderRadius: "10px",
                marginTop: "10px",
                width:'100px'
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: 'linear-gradient(to right, #060606, #060332)',
              padding: "20px",
              border: "2px solid white",
              borderRadius: "10px",
              width: "400px",
              height: "300px",
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: "40px",width:'200px',marginLeft:'110px',color:'red' }}>Forgot Password</h2>
            {!otpSent ? (
              <>
                <div style={{ display: "flex", marginBottom: "10px" }}>
                  <label style={{ width: "60px", textAlign: "left" }}>Email:</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    placeholder="Enter Your Personal Email"
                    onChange={(e) => setForgotEmail(e.target.value)}
                    style={{ marginLeft: "0px", width: "300px",marginTop:'-5px',marginBottom:'10px' }}
                  />
                </div>
                <button
                  onClick={handleForgotPassword}
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    width: "100%",
                  }}
                >
                  Send OTP
                </button>
              </>
            ) : !otpVerified ? (
              <>
                <div style={{ display: "flex", marginBottom: "10px" }}>
                  <label style={{width: "50px", textAlign: "left" }}>OTP :</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}   
                    placeholder="Enter Your 6 Digit OTP"               
                    style={{marginLeft: "0px", width: "300px",marginTop:'-5px',marginBottom:'10px' }}
                  />
                </div>
                <button
                  onClick={handleVerifyOtp}
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    width: "100%",
                  }}
                >
                  Verify OTP
                </button>
                {otpError && <p style={{ color: "red" }}>{otpError}</p>}
              </>
            ) : (
              <>
                <div style={{ display: "flex", marginBottom: "10px" }}>
                  <label style={{width: "150px", textAlign: "left" }}>New Password:</label>
                  <input
                    type="password"
                    value={newPassword}
                    placeholder="Enter New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{marginLeft: "0px", width: "300px",marginTop:'-5px',marginBottom:'10px'}}
                  />
                </div>
                <div style={{ display: "flex", marginBottom: "10px" }}>
                  <label style={{width: "170px", textAlign: "left"}}>Confirm Password:</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    placeholder="Confirm Your Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{marginLeft: "0px", width: "250px",marginTop:'-5px',marginBottom:'10px' }}
                  />
                </div>
                <button
                  onClick={handleUpdatePassword}
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    width: "100%",
                  }}
                >
                  Update Password
                </button>
              </>
            )}
            {passwordUpdated && <p style={{ color: "green" }}>Password updated successfully.</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button
              onClick={() => setShowModal(false)}
              style={{
                backgroundColor: "gray",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                width: "100%",
                marginTop: "10px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
