import { useLocation } from "react-router-dom"; // Import useLocation
import Structure from "./Structure";
import "../CSS/SubConstruction.css";
import { FaLocationDot } from "react-icons/fa6";
import blacktextlogo from "../Images/blacktextlogo.png";
import dashboard from '../Images/dashboard.jpg';
import material from '../Images/materialupdate.png';
import progress from '../Images/progress.jpg';
import overview from '../Images/Overview.jpg';
import { useNavigate } from "react-router-dom";
import SiteOverView from "./SiteOverView";



function SubConstruction() {
  const location = useLocation();
  const navigate = useNavigate();
  const { siteDetails } = location.state || {}; // Retrieve site details from state
  const handleButtonClick = (buttonType) => {
    console.log(`Button ${buttonType} clicked`);
    alert(`Button ${buttonType} clicked`);
  };
  const Progressclick = () => {
    navigate("/progress", { state: { siteDetails } }); // Pass siteDetails in the state
  };

  const Materialclick = () => {
    navigate("/material", { state: { siteDetails } }); // Pass siteDetails in the state
  };

  const Overviewclick = () => {
    navigate("/SiteOverView", { state: { siteDetails } }); // Pass siteDetails in the state
  };

  const Sitedashboardclick = () => {
    navigate("/Sitedashboard", { state: { siteDetails } }); // Pass siteDetails in the state
  };

  const Safetppeclick = () =>{
    navigate("/SiteSafety",{state: {siteDetails}});
  }

  return (
    <div className="SubConstruction">
      <div>
        <Structure />
      </div>

      {/* Main Construction Details */}
      <div className="Construction-details">
        {siteDetails ? (
          <div>
            <div style={{marginLeft:"80px"}}>
                <strong><FaLocationDot size={30} fill="red" style={{marginLeft:"-50px",marginTop:"20px"}}/></strong><p style={{marginTop:"-30px",marginLeft:"0px",fontWeight:'bold'}}> {siteDetails.location}</p>
            </div>

            <div style={{display:'flex',flexDirection:'row',gap:'250px',textAlign:'left',marginTop:"-20px"}}> 
                <div style={{marginLeft:"30px"}}> 
                    <p><strong>Site ID:</strong> {siteDetails.siteID}</p>
                    <p><strong>Site Owner:</strong> {siteDetails.siteOwner}</p>
                    <p><strong>Land Size:</strong> {siteDetails.land}</p>
                </div>
                <div>
                    <img src={blacktextlogo} alt="OnsiteIQ Logo" style={{ width: "200px", height: "80px",opacity:"0.6"}} />
                </div>
                <div> 
                    <p><strong>Start Date:</strong> {new Date(siteDetails.initiationDate).toLocaleDateString()}</p>
                    <p><strong>Site Manager:</strong> {siteDetails.siteManager}</p>
                    <p><strong>Manager Contact:</strong> {siteDetails.managerContact}</p>
                </div>
            </div>
            

          </div>
        ) : (
          <p>No site details available.</p>
        )}
      </div>

      <div className="sub-options">
        <div className="sub-options1">
                <button
                className="image-button"
                onClick={Sitedashboardclick}
                 style={{borderRadius:"16px",objectFit: "contain"}}>
                <img src={dashboard} alt="Option 1A" style={{ width: "300px", height: "203px",borderRadius:"16px"}} />
                </button>
                <button
                className="image-button"
                onClick={Progressclick} 
                style={{borderRadius:"16px",objectFit: "contain"}}>
                <img src={progress} alt="Option 1B" style={{ width: "300px", height: "203px",borderRadius: "16px" }} />
                </button>
            </div>
            
            <div className="sub-options2">
                <button
                className="image-button"
                onClick={Materialclick}
                style={{borderRadius:"16px",objectFit: "contain"}}>
                <img src={material} alt="Option 2A" style={{ width: "300px", height: "203px",borderRadius: "16px" }} />
                </button>
                <button
                className="image-button"
                onClick={Overviewclick}
                style={{borderRadius:"16px",objectFit: "cover"}}>
                <img src={overview} alt="Option 2B" style={{ width: "300px", height: "203px",borderRadius:'16px',objectFit: "contain" }} />
                </button>
            </div>
      </div>


    </div>
  );
}

export default SubConstruction;
