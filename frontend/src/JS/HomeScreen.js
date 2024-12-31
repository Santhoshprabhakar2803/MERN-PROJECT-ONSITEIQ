import React, { useEffect, useState, useRef } from "react";
import "../CSS/HomeScreen.css";
import logo from '../Images/Main-Logo.png';
import img1 from '../Images/layer2img.png';
import img2 from '../Images/safety-img.png';
import mem1 from '../Images/member1.jpg';
import mem2 from '../Images/member2.jpg';
import mem3 from '../Images/memeber3.jpg';
import mem4 from '../Images/member4.jpg';
import { FaSearch } from "react-icons/fa";
import { FaCube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaDribbble } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
// Navigate
import { useNavigate } from 'react-router-dom';
import  MainVideo  from '../Images/MainScreenVideo.mp4'
import Register from "./Register";
import Login from "./Login";



function HomeScreen({}) {
  const navigate = useNavigate();

        const Login = () => {
          navigate('/login'); // Navigate to MainScreen
        };
        const Register = () => {
          navigate('/register');
        }
        
        useEffect(() => {
          const handleScroll = () => {
              const header = document.querySelector(".Header");
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

      // For scrolling in same screen
      const section1Ref = useRef(null);
      const section2Ref = useRef(null);
      const section3Ref = useRef(null);
      // const section2Ref = useRef(null);
      const scrollToRef = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };

  return (
    <div className="Main">
      <div className="Header">
        <img src={logo} className="Logo" alt="Logo" />
        <nav className="Top-options">
          <ul className="uls">
            <li>Home</li>
            <li onClick={() => scrollToRef(section1Ref)}>Projects</li>
            <li onClick={() => scrollToRef(section2Ref)}>Safety Compilance</li>
            <li onClick={() => scrollToRef(section3Ref)}>Contact Us</li>
          </ul>
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <button> <FaSearch /> </button>
          </div>
        </nav>
      </div>

      <div  ref={section1Ref} className="layers">
        <div className="layer1">
             <h1>Unlock Your Potential with Our Solutions</h1>
             <p className="description">Track real-time weather and site conditions with live IoT data. Visualize progress through interactive charts to ensure safe and efficient construction. Make smarter decisions, every step of the way!  🚧</p>
             <button style={{backgroundColor: "transparent",padding:"15px",border:"2px solid white",borderRadius: "10px"}}
             onClick={Login}>Get Started</button>
             <button style={{backgroundColor: "transparent",padding:"15px",border:"2px solid white",borderRadius: "10px",marginLeft: "30px"}}
             onClick={Register}>Sign Up</button>
        </div>
        <div className="video-controls">
        <video autoPlay muted loop className="styled-videos">
            <source src={MainVideo} type="video/mp4" />
            Your browser does not support the video tag.
        </video>

        </div>
      </div>


      <div className="layers2">
        <div className="layer2">
             <img src={img1} className="layer2img" alt="layer2img" />
        </div>
        <div className="content">
        <h1>Effortlessly Monitor Your Project Progress</h1>
             <p className="description2">Our Project Progress Tracker provides a comprehensive overview of your construction milestones. With a clear timeline view, you can easily assess project phases and completion rates.</p>
        </div>
      </div>
      <div className="cube">
          <div className="cube1">
             <p className="cubeicon"><FaCube /></p>
             <h2 style={{marginLeft:"0px"}}>Milestone Management</h2>
             <p style={{width:"250px",textAlign:"left"}}>Stay on top of every milestone with real-time updates.</p>
          </div>
          <div className="cube2">
             <p className="cubeicon"><FaCube /></p>
             <h2 style={{marginLeft:"0px"}}>Timeline Overview</h2>
             <p style={{width:"250px",textAlign:"left"}}>Visualize your project timeline for better planning and execution.</p>
          </div>
        </div>
        <button style={{width:"200px",height:"50px",backgroundColor: "transparent",padding:"15px",border:"3px solid white",borderRadius: "2px",marginLeft: "30px",
          marginLeft:'750px',marginTop:'-75px'
        }}>Learn More</button>


        <div ref={section2Ref} className="layer3">
          <div className="safety">
            <h1>Ensuring Safety Compliance in Construction Monitoring</h1>
            <p className="description3">Our services provide comprehensive safety compliance solutions tailored for the construction industry. We monitor projects closely to ensure adherence to safety standards, protecting both workers and investments.</p>
          </div>
        </div>
        <div className="cubes">
          <div className="cube11">
             <p className="cubeicon"> <FaCube /> </p>
             <h2>Real-Time Monitoring for Enhanced Safety Compliance</h2>
             <p style={{width:"250px",textAlign:"left"}}>Stay informed with instant alerts and updates.</p>
          </div>
          <div className="cube22">
             <p className="cubeicon"><FaCube /></p>
             <h2>Comprehensive Reporting for Informed Decision-Making</h2>
             <p style={{width:"250px",textAlign:"left"}}>Access detailed reports to track compliance progress.</p>
          </div>
          <div className="cube3">
             <p className="cubeicon"><FaCube /></p>
             <h2>User-Friendly Interface for Seamless Navigation</h2>
             <p style={{width:"250px",textAlign:"left"}}>Easily manage safety protocols and site data.</p>
          </div>
        </div>
        <button style={{backgroundColor: "transparent",padding:"15px",border:"2px solid white",borderRadius: "3px",
        width:"200px",height:"50px",marginLeft:'50px',marginTop:'25px'
        }}>Get Started</button>
             <button style={{backgroundColor: "transparent",padding:"15px",border:"2px solid white",borderRadius: "3px",marginLeft: "30px",
              width:"200px",height:"50px",marginLeft:'300px',marginTop:'-50px'
             }}>Sign Up</button>


        <div className="safety-detail">
          <div className="safety-details">
            <h1>Ensuring Safety in Construction Monitoring</h1>
            <img src={img2} alt="layer4img" />
          </div>

          <div className="safetycontent">
             <h1>Effortlessly Monitor Your Project Progress</h1>
             <p className="safetydescription2">Our Project Progress Tracker provides a comprehensive overview of your construction milestones. With a clear timeline view, you can easily assess project phases and completion rates.</p>
          </div>

          <div className="safetycube">
          <div className="safetycube1">
             <p className="cubeicon"><FaCube /></p>
             <h2>Instant Alerts</h2>
             <p style={{width:"250px",textAlign:"left"}}>Receive immediate notifications for any safety compliance issues on your construction sites.</p>
          </div>
          <div className="safetycube2">
             <p className="cubeicon"><FaCube /></p>
             <h2>Comprehensive Reporting</h2>
             <p style={{width:"250px",textAlign:"left"}}>Access detailed reports to track progress and ensure adherence to safety regulations.</p>
          </div>
        </div>
        <button style={{width:"200px",height:"50px",backgroundColor: "transparent",padding:"15px",border:"3px solid white",borderRadius: "2px",marginLeft: "30px",
          marginLeft:'700px',marginTop:'20px',marginBottom:'40px'
        }}>Learn More</button>
        <button style={{width:"200px",height:"50px",backgroundColor: "transparent",padding:"15px",border:"3px solid white",borderRadius: "5px",marginLeft: "30px",
          marginLeft:'920px',marginTop:'-90px',marginBottom:'40px'
        }}>Sign Up</button>

        </div>   


        <div ref={section3Ref} className="Memebers">
              <div className="member">
                <h5 style={{textAlign:"center"}}>Meet</h5>
                <h1 style={{textAlign:"center"}}>Our Teams</h1>
                <h3 style={{textAlign:"center"}}>Dedicated professionals committed to your construction success.</h3>
                  <div className="profile">
                        <div className="pro1">
                          <img src={mem1} alt="layer4img" style={{marginLeft:"70px"}} />
                          <h2 style={{textAlign:"center"}}>Alice JohnSon</h2>
                          <h3 style={{marginTop:"-15px",textAlign:"center"}}>CEO (Chief Executive Officer)</h3>
                          <h5 style={{width:"300px",textAlign:"center",marginLeft:"0px",lineHeight:"2"}}>The top executive responsible for overall management and major decisions.</h5>
                          <div className="icons">
                              <h5><FaLinkedin /></h5>
                              <h5><FaXTwitter /></h5>
                              <h5><FaDribbble /></h5>
                          </div>
                        </div>
                        <div className="pro2">
                          <img src={mem2} alt="layer4img"style={{marginLeft:"70px"}} />
                          <h2 style={{textAlign:"center"}}>Bob Smith</h2>
                          <h3 style={{marginTop:"-15px",textAlign:"center"}}>Founder</h3>
                          <h5 style={{width:"300px",textAlign:"center",marginLeft:"0px",lineHeight:"2"}}>The individual who started the company and may hold various roles.</h5>
                          <div className="icons">
                              <h5><FaLinkedin /></h5>
                              <h5><FaXTwitter /></h5>
                              <h5><FaDribbble /></h5>
                          </div>
                        </div>
                        <div className="pro3">
                          <img src={mem3} alt="layer4img"style={{marginLeft:"70px"}} />
                          <h2 style={{textAlign:"center"}}>Catherine Lee</h2>
                          <h3 style={{marginTop:"-15px",textAlign:"center"}}>Project Manager</h3>
                          <h5 style={{width:"300px",textAlign:"center",marginLeft:"0px",lineHeight:"2"}}>Oversees the planning and execution of the construction project.</h5>
                          <div className="icons">
                              <h5><FaLinkedin /></h5>
                              <h5><FaXTwitter /></h5>
                              <h5><FaDribbble /></h5>
                          </div>
                        </div>
                        <div className="pro4">
                          <img src={mem4} alt="layer4img"style={{marginLeft:"70px"}} />
                          <h2 style={{textAlign:"center"}}>David Brown</h2>
                          <h3 style={{marginTop:"-15px",textAlign:"center"}}>Site Supervisor</h3>
                          <h5 style={{width:"300px",textAlign:"center",marginLeft:"0px",lineHeight:"2"}}>Manages daily operations and ensures safety and quality on site.</h5>
                          <div className="icons">
                              <h5><FaLinkedin /></h5>
                              <h5><FaXTwitter /></h5>
                              <h5><FaDribbble /></h5>
                          </div>
                        </div>
                  </div>

                  <div className="profile">
                        <div className="pro1">
                          <img src={mem1} alt="layer4img"style={{marginLeft:"70px"}} />
                          <h2 style={{textAlign:"center"}}>Emma Wilson</h2>
                          <h3 style={{marginTop:"-15px",textAlign:"center"}}>Safety Officer</h3>
                          <h5 style={{width:"300px",textAlign:"center",marginLeft:"0px",lineHeight:"2"}}>Ensures compliance with safety regulations and conducts safety training.</h5>
                          <div className="icons">
                              <h5><FaLinkedin /></h5>
                              <h5><FaXTwitter /></h5>
                              <h5><FaDribbble /></h5>
                          </div>
                        </div>
                        <div className="pro2">
                          <img src={mem2} alt="layer4img" style={{marginLeft:"70px"}} />
                          <h2 style={{textAlign:"center"}}>Frank Green</h2>
                          <h3 style={{marginTop:"-15px",textAlign:"center"}}>Quality Control Supervisor</h3>
                          <h5 style={{width:"300px",textAlign:"center",marginLeft:"0px",lineHeight:"2"}}>Checks materials and workmanship to meet standards.</h5>
                          <div className="icons">
                              <h5><FaLinkedin /></h5>
                              <h5><FaXTwitter /></h5>
                              <h5><FaDribbble /></h5>
                          </div>
                        </div>
                        <div className="pro3">
                          <img src={mem3} alt="layer4img" style={{marginLeft:"70px"}} />
                          <h2 style={{textAlign:"center"}}>Grace Taylor</h2>
                          <h3 style={{marginTop:"-15px",textAlign:"center"}}>Architect</h3>
                          <h5 style={{width:"300px",textAlign:"center",marginLeft:"0px",lineHeight:"2"}}>Designs the building and ensures construction follows the plans.</h5>
                          <div className="icons">
                              <h5><FaLinkedin /></h5>
                              <h5><FaXTwitter /></h5>
                              <h5><FaDribbble /></h5>
                          </div>
                        </div>
                        <div className="pro4">
                          <img src={mem4} alt="layer4img" style={{marginLeft:"70px"}} />
                          <h2 style={{textAlign:"center"}}>James Smith</h2>
                          <h3 style={{marginTop:"-15px",textAlign:"center"}}>Accountant</h3>
                          <h5 style={{width:"300px",textAlign:"center",marginLeft:"0px",lineHeight:"2"}}>Handles budgeting, expenses, and financial reporting.</h5>
                          <div className="icons">
                              <h5><FaLinkedin /></h5>
                              <h5><FaXTwitter /></h5>
                              <h5><FaDribbble /></h5>
                          </div>
                        </div>
                  </div>
          </div>          
        </div>  


        <div className="guide">
          <h5>Welcome</h5>
          <h1>Your Guide to Construction Site Monitoring</h1>
          <p style={{width:"800px",textAlign:"center",marginLeft:"0px",lineHeight:"2",fontSize:"18px",marginTop:"-30px"}}>Our construction site monitoring service is designed to keep you informed and in control. Follow these simple steps to maximize your experience.</p>
        </div>
        <div className="cubes" style={{marginLeft:"150px"}}>
          <div className="cube11">
             <p className="cubeicon"> <FaCube /> </p>
             <h2>Real-Time Monitoring for Enhanced Safety Compliance</h2>
             <p style={{width:"250px",textAlign:"left"}}>Stay informed with instant alerts and updates.</p>
          </div>
          <div className="cube22">
             <p className="cubeicon"><FaCube /></p>
             <h2>Comprehensive Reporting for Informed Decision-Making</h2>
             <p style={{width:"250px",textAlign:"left"}}>Access detailed reports to track compliance progress.</p>
          </div>
          <div className="cube3">
             <p className="cubeicon"><FaCube /></p>
             <h2>User-Friendly Interface for Seamless Navigation</h2>
             <p style={{width:"250px",textAlign:"left"}}>Easily manage safety protocols and site data.</p>
          </div>
        </div>
        <button style={{backgroundColor: "transparent",padding:"15px",border:"2px solid white",borderRadius: "3px",
        width:"200px",height:"50px",marginLeft:'530px',marginTop:'25px'
        }}>Get Started</button>
             <button style={{backgroundColor: "transparent",padding:"15px",border:"2px solid white",borderRadius: "3px",marginLeft: "30px",
              width:"200px",height:"50px",marginLeft:'750px',marginTop:'-50px'
             }}>Learn More</button>
        

        <div className="contactus">
          <div className="contactheading">
            <h2 style={{textAlign:"center"}}>Contact Us</h2>
          </div>

          <div className="contactdesc">
            <div className="contactsub1">
            <p>Expert Building Construction Monitoring Services</p>
            </div>
            <div className="contactsub2">
              <p>Ensure the success of your construction projects with our comprehensive monitoring services. We provide real-time insights and expert oversight to keep your build on track.</p>
              <button style={{backgroundColor: "white",padding:"15px",border:"2px solid white",borderRadius: "3px",
        width:"200px",height:"50px",marginLeft:'0px',marginTop:'25px',color:"black"
        }}>Get Started</button>
             <button style={{backgroundColor: "transparent",padding:"15px",border:"2px solid white",borderRadius: "3px",marginLeft: "30px",
              width:"200px",height:"50px",marginLeft:'25px',marginTop:'-50px',marginBottom:"50px"
             }}>Learn More</button>
            </div>
          </div>

        </div>




    </div>
  );
}

export default HomeScreen;
