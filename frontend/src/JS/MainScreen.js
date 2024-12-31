import React, { useEffect,useState } from 'react';
import "../CSS/MainScreen.css";
import SidePanel from './SidePanel';
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
import { FaHome } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import  MainVideos  from '../Images/MainScreenVideos.mp4'
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RiAdminFill } from "react-icons/ri";



function MainScreen({}) {

  // For Username
  const location = useLocation();
  const email = location.state?.email || "Guest";
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

    const navigate = useNavigate();
    const navmap = () => {
      navigate("/Maps", { state: { email } });
    }
    const handleDoubleTap = () => {
      navigate('/password')
    };
     
  return (
    <div className="MainScreens">
      <div className="MainScreen-Header">
        <img src={logo} className="Logo" alt="Logo" />
        <nav className="Top-Panel">
          <ul className='ull'>
            <li><FaHome size={30} style={{marginBottom:"-5px"}}/> Home</li>
            <li onClick={navmap}><FaMapMarkerAlt size={30} style={{marginBottom:"-5px",marginRight:"5px"}} />Map</li>
          </ul>
          <div className="Main-dropdown" style={{display:"flex",flexDirection:"row",border:"0.5px solid white",
            width:"100px",height:"50px",justifyContent:"center",padding:"5px",gap:"5px",borderRadius:"20px",
          }}>
            <p><RxAvatar size={30} style={{marginTop:"-5px",marginLeft:"20px"}}/></p>
            <p onClick={toggleDropdown}><RiArrowDropDownLine size={40} style={{marginTop:"-10px",marginRight:"10px"}}/></p>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <button> <FaSearch /> </button>
          </div>
        </nav>
      </div>

      <div style={{marginTop:"110px"}}>
          <SidePanel />
      </div>
        


      <div className='MainScreen-Body'>
        <div className='MainScreen-Body1'>
        <h1>Welcome to Onsite<span style={{color:"#C75C27"}}>IQ</span> Building Construction Monitoring Site! We’re thrilled to have you on board.</h1>
        </div>
        <h2 style={{ fontSize: "24px", margin: "0" }}>
        Hello{" "}
        <span style={{ color: "#4CAF50", fontWeight: "bold" }}>{username}</span>, Welcome Aboard!
      </h2>
      <div className='MainScreen-Video'>
        <video autoPlay muted loop className="styled-videos">
            <source src={MainVideos} type="video/mp4" />
            Your browser does not support the video tag.
        </video>

        </div>


        <div className='MainScreen-features'>
          <div className='feature1'>
            <p>Our platform provides you with real-time updates and comprehensive insights into your construction projects. Whether you’re tracking progress, ensuring safety compliance, or managing resources, our tools are designed to make your job easier and more efficient.</p>
            <p>We are committed to supporting you throughout your project. If you need any assistance, our support team is here to help.
            Let’s build the future together!</p>
          </div>
          <hr class="vertical-hr" />
          <div className='feature2'>
              <h4 style={{marginLeft:"0px"}}>Key Features:</h4>
              <ul>
                  <li>Real-Time Monitoring: Stay updated with the latest developments on your project site.</li>
                  <li>Safety Compliance: Ensure all safety regulations are met with our automated alerts and checklists.</li>
                  <li>Resource Management: Efficiently manage your materials, labor, and budget.</li>
                  <li>Incident Reporting: Easily log and track any incidents on site for quick resolution.</li>
              </ul>
          </div>
        </div>

       <div className="MainScreen-layers2">
        <div className="MainScreen-layer2">
             <img src={img1} className="MainScreen-layer2img" alt="layer2img" />
        </div>
        <div className="MainScreen-content">
        <h3 style={{marginLeft:"0px"}}>Effortlessly Monitor Your Project Progress</h3>
             <p className="MainScreen-description2">Our Project Progress Tracker provides a comprehensive overview of your construction milestones. With a clear timeline view, you can easily assess project phases and completion rates.</p>
        </div>
      </div>
      <div className="MainScreen-cube">
          <div className="MainScreen-cube1">
             <p className="MainScreen-cubeicon"><FaCube /></p>
             <h2 style={{marginLeft:"0px"}}>Milestone Management</h2>
             <p style={{width:"250px",textAlign:"left"}}>Stay on top of every milestone with real-time updates.</p>
          </div>
          <div className="MainScreen-cube2">
             <p className="MainScreen-cubeicon"><FaCube /></p>
             <h2 style={{marginLeft:"0px"}}>Timeline Overview</h2>
             <p style={{width:"250px",textAlign:"left"}}>Visualize your project timeline for better planning and execution.</p>
          </div>
          <button style={{width:"200px",height:"50px",backgroundColor: "transparent",padding:"15px",border:"3px solid white",borderRadius: "2px",
          marginLeft:'600px',marginBottom:"50px"
        }}>Learn More</button>
        </div>


        <div className="MainScreen-safety-detail">
          <div className="MainScreen-safety-details">
            <h2 style={{marginLeft:"0px",width:"600px"}}>Ensuring Safety in Construction Monitoring</h2>
            <img src={img2} alt="layer4img" />
          </div>

          <div className="MainScreen-safetycontent">
             <h2 style={{marginLeft:'310px',width:'500px'}}>Stay Ahead with Real-Time Monitoring Solutions</h2>
             <p className="MainScreen-safetydescription2">Our Project Progress Tracker provides a comprehensive overview of your construction milestones. With a clear timeline view, you can easily assess project phases and completion rates.</p>
          </div>

          <div className="MainScreen-safetycube">
          <div className="MainScreen-safetycube1">
             <p className="MainScreen-cubeicon"><FaCube /></p>
             <h2>Instant Alerts</h2>
             <p style={{width:"250px",textAlign:"left"}}>Receive immediate notifications for any safety compliance issues on your construction sites.</p>
          </div>
          <div className="MainScreen-safetycube2">
             <p className="MainScreen-cubeicon"><FaCube /></p>
             <h2 style={{width:"500px"}}>Comprehensive Reporting</h2>
             <p style={{width:"250px",textAlign:"left",marginTop:'-28px'}}>Access detailed reports to track progress and ensure adherence to safety regulations.</p>
          </div>
        </div>
        </div>   
        
        <div className="MainScreen-Memebers">
              <div className="MainScreen-member">
                <h5 style={{marginLeft:"550px"}}>Meet</h5>
                <h1 style={{marginLeft:"480px"}}>Our Teams</h1>
                <h3 style={{marginLeft:"280px"}}>Dedicated professionals committed to your construction success.</h3>
                  <div className="MainScreen-profile">
                        <div className="MainScreen-pro1">
                          <img src={mem1} alt="layer4img" />
                          <h2>Alice JohnSon</h2>
                          <h3 style={{marginTop:"-15px",alignItems:'center'}}>CEO (Chief Executive Officer)</h3>
                          <h5 style={{width:"300px",textAlign:"center",marginLeft:"0px",lineHeight:"2"}}>The top executive responsible for overall management and major decisions.</h5>
                          <div className="MainScreen-icons">
                              <h5><FaLinkedin /></h5>
                              <h5><FaXTwitter /></h5>
                              <h5><FaDribbble /></h5>
                          </div>
                        </div>
                        <div className="MainScreen-pro2">
                          <img src={mem2} alt="layer4img" />
                          <h2>Bob Smith</h2>
                          <h3 style={{marginTop:"-15px"}}>Founder</h3>
                          <h5 style={{width:"300px",textAlign:"center",marginLeft:"0px",lineHeight:"2"}}>The individual who started the company and may hold various roles.</h5>
                          <div className="MainScreen-icons">
                              <h5><FaLinkedin /></h5>
                              <h5><FaXTwitter /></h5>
                              <h5><FaDribbble /></h5>
                          </div>
                        </div>
                        <div className="MainScreen-pro3">
                          <img src={mem3} alt="layer4img" />
                          <h2>Catherine Lee</h2>
                          <h3 style={{marginTop:"-15px"}}>Project Manager</h3>
                          <h5 style={{width:"300px",textAlign:"center",marginLeft:"0px",lineHeight:"2"}}>Oversees the planning and execution of the construction project.</h5>
                          <div className="MainScreen-icons">
                              <h5><FaLinkedin /></h5>
                              <h5><FaXTwitter /></h5>
                              <h5><FaDribbble /></h5>
                          </div>
                        </div>
                        <div className="MainScreen-pro4">
                          <img src={mem4} alt="layer4img" />
                          <h2>David Brown</h2>
                          <h3 style={{marginTop:"-15px"}}>Site Supervisor</h3>
                          <h5 style={{width:"300px",textAlign:"center",marginLeft:"0px",lineHeight:"2"}}>Manages daily operations and ensures safety and quality on site.</h5>
                          <div className="MainScreen-icons">
                              <h5><FaLinkedin /></h5>
                              <h5><FaXTwitter /></h5>
                              <h5><FaDribbble /></h5>
                          </div>
                        </div>
                  </div>

                  <div className="MainScreen-profile">
                        <div className="MainScreen-pro1">
                          <img src={mem1} alt="layer4img" />
                          <h2>Emma Wilson</h2>
                          <h3 style={{marginTop:"-15px"}}>Safety Officer</h3>
                          <h5 style={{width:"300px",textAlign:"center",marginLeft:"0px",lineHeight:"2"}}>Ensures compliance with safety regulations and conducts safety training.</h5>
                          <div className="MainScreen-icons">
                              <h5><FaLinkedin /></h5>
                              <h5><FaXTwitter /></h5>
                              <h5><FaDribbble /></h5>
                          </div>
                        </div>
                        <div className="MainScreen-pro2">
                          <img src={mem2} alt="layer4img" />
                          <h2>Frank Green</h2>
                          <h3 style={{marginTop:"-15px"}}>Quality Control Supervisor</h3>
                          <h5 style={{width:"300px",textAlign:"center",marginLeft:"0px",lineHeight:"2"}}>Checks materials and workmanship to meet standards.</h5>
                          <div className="MainScreen-icons">
                              <h5><FaLinkedin /></h5>
                              <h5><FaXTwitter /></h5>
                              <h5><FaDribbble /></h5>
                          </div>
                        </div>
                        <div className="MainScreen-pro3">
                          <img src={mem3} alt="layer4img" />
                          <h2>Grace Taylor</h2>
                          <h3 style={{marginTop:"-15px"}}>Architect</h3>
                          <h5 style={{width:"300px",textAlign:"center",marginLeft:"0px",lineHeight:"2"}}>Designs the building and ensures construction follows the plans.</h5>
                          <div className="MainScreen-icons">
                              <h5><FaLinkedin /></h5>
                              <h5><FaXTwitter /></h5>
                              <h5><FaDribbble /></h5>
                          </div>
                        </div>
                        <div className="MainScreen-pro4">
                          <img src={mem4} alt="layer4img" />
                          <h2>James Smith</h2>
                          <h3 style={{marginTop:"-15px"}}>Accountant</h3>
                          <h5 style={{width:"300px",textAlign:"center",marginLeft:"0px",lineHeight:"2"}}>Handles budgeting, expenses, and financial reporting.</h5>
                          <div className="MainScreen-icons">
                              <h5><FaLinkedin /></h5>
                              <h5><FaXTwitter /></h5>
                              <h5><FaDribbble /></h5>
                          </div>
                        </div>
                  </div>
          </div>          
        </div>  



        <div className="MainScreen-contactus">
          <div className="MainScreen-contactheading">
            <h2>Contact Us</h2>
          </div>

          <div className="MainScreen-contactdesc">
            <div className="MainScreen-contactsub1">
            <p>Expert Building Construction Monitoring Services</p>
            </div>
            <div className="MainScreen-contactsub2">
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <p><RxAvatar size={40}className='drop-avatar'/></p>
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
              margin: '0',
              marginTop:'50px',
              padding: '5px 10px',
              cursor: 'pointer',
              color:'black',
              fontWeight:"bold",
              color: "#4CAF50",
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
          >
            Contact
          </button>
        </div>
      )}   





















    </div>
  );
}

export default MainScreen;