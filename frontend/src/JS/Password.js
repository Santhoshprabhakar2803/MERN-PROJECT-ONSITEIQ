import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Password.css";
import bg from '../Images/passwordimg.png'
import { IoMdArrowRoundBack } from "react-icons/io";

function Password() {

  // For password input
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  const correctPassword = "123456"; // Change this to your integrated password

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    if (password === correctPassword) {
      navigate('/Page2'); // Redirect to DashboardPage
    } else {
      setErrorMessage("Incorrect password! Try again.");
    }
  };

  const backbutton = () => {
    navigate('/main');
  }

  return (
    <div className="password-mainScreens">
      <img src={bg} alt='bgimage' className="bgimg"/>
      
      <div className="password-main">
      <button className="back-button" onClick={backbutton}><IoMdArrowRoundBack size={22}/></button>
          <div className="password-container">
            <h1 style={{textAlign:'center',color:'black',marginTop:'50px'}}>Enter Password</h1>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              className="password-input"
            />
            <button onClick={handleSubmit} className="submit-btn">Submit</button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
      </div>
     
    </div>
  );
}

export default Password;
