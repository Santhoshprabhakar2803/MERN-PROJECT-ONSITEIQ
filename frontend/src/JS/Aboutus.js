import React from "react";
import logo1 from "../Images/Main-Logo.png";
import john from "../Images/john-doe.png";
import jane from "../Images/jane-smith.png";
import mike from "../Images/mike-johnson.png";
import { IoTelescopeOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { PiStamp } from "react-icons/pi";
import { RiTeamLine } from "react-icons/ri";
import { FaTwitter } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { SiTrustpilot } from "react-icons/si";
import Structure from "./Structure";
import "../CSS/Aboutus.css";

function Aboutus() {
  return (
    <div className="MainScreens">
      <Structure />
      <div className="About-us-Main">
        <div className="card">
          <header className="About_us-header">
            <div className="About_us-overlay">
              <div className="About_us-header-content">
                <h1>About Us</h1>
                <p>Building the future with precision and integrity.</p>
                <button className="About_us-learn-more">Learn More</button>
              </div>
            </div>
          </header>
        </div>

        <div className="About_us-card1">
          <h3>Our Mission</h3>
          <div className="About_us-icon"><IoTelescopeOutline size={32} /></div>
          <p1>To build sustainable and innovative structures that enhance communities and improve quality of life.</p1>
        </div>

        <div className="About_us-card1">
          <h3>Our Vision</h3>
          <div className="About_us-icon"><FaRegEye size={32} /></div>
          <p2>To build a sustainable future through innovative construction solutions that meet the needs of our clients and communities.</p2>
        </div>


        <div className="About_us-card2">
          <h3>Our Core Values</h3>
          <div className="About_us-stampandteam">
            <p className="About_us-icon"><SiTrustpilot size={32} /></p>
            <h4> Integrity: We uphold the highest standards of integrity in all of our actions! </h4>
            <p className="About_us-icon"><PiStamp size={32} /></p>
            <h4>Quality: We provide outstanding products and unsurpassed service that deliver premium value to our customers.</h4>
            <p className="About_us-icon"><RiTeamLine size={32} /></p>
            <h4>Teamwork: We work together, across boundaries, to meet the needs of our customers and to help the company win.</h4>
          </div>
        </div>


        <div className="About_us-card3">
          <h3>Meet Our Team</h3>
          <div className="Team-intro">
            <div className="About_us-pic">
              <img src={john} className="Profile-dp" alt="Logo" />
              <p>John Doe </p>
              <p className="Staff-role">CEO & Founder</p>
              <p className="about-pep">With over 20 years in the construction industry, John leads the company with a passion for innovation and quality.</p>
            </div>
            <div className="About_us-pic">
              <img src={jane} className="Profile-dp" alt="Logo" />
              <p>Jane Smith</p>
              <p className="Staff-role">Project Manager</p>
              <p className="about-pep">Jane has a decade of experience managing large-scale construction projects with precision and professionalism.</p>
            </div>
            <div className="About_us-pic">
              <img src={mike} className="Profile-dp" alt="Logo" />
              <p>Mike Brown</p>
              <p className="Staff-role">Lead Architect</p>
              <p className="about-pep">Mike is known for his creative designs and attention to detail that bring projects to life.</p>
            </div>
          </div>
        </div>

        <div className="About_us-card4">
          <h3 className="reach" >Reach Out Today</h3>
          <p className="reachsent">We'd love to hear from you! Contact us for any inquiries or project discussions.</p>
        </div>
        <div className="card6">
          <footer className="footer">
            <div className="footer-logo">
              <img src={logo1} className="Logo" alt="Logo" />
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <ul>
                  <li>Features</li>
                  <li>Pricing</li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <ul>
                  <li>Blog</li>
                  <li>User guides</li>
                  <li>Webinars</li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                  <li>About us</li>
                  <li>Contact us</li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Plans & Pricing</h4>
                <ul>
                  <li>Personal</li>
                  <li>Start up</li>
                  <li>Organization</li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <div className="footer-legal">
                <p>© 2024 Brand, Inc.PrivacyTermsSitemap</p>
              </div>
              <div className="footer-social">
                <i><FaTwitter /></i>
                <i><FaFacebook /></i>
                <i><FaLinkedin /></i>
                <i><FaYoutube /></i>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Aboutus;
