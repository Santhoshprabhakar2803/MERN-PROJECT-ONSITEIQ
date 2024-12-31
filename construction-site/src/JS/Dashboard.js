import React, { useEffect, useState } from "react";
import "../CSS/Dashboard.css";
import Structure from "./Structure";
import GaugeChart from "./GaugeChart";
import DonutChart from "./DonutChart";
import BarLineChart from "./BarLineChart";
import RadarChart from "./RadarChart";
import RadialChart from "./RadicalChart";


function Dashboard({}) {
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

  return (
    <div className="DashBoard-MainScreens">
        <div>
        <Structure/>
        </div>

        {/* Main DashBoard */}
        {/* Align According to screen */}
        <div className="MainDashboard">
            

            <div className="GaugeChart-layer1">
              {/* Integrating the GaugeChart here */}
          <GaugeChart />
          </div>

          <div className="BarLineChart-layer5">
          <BarLineChart/>
          </div>
        

            <div className="DonutChart-layer2">

              <DonutChart/>   
           </div>
           
              
              <div className="RadarChart-layer4">
               <RadarChart/>
                </div>

                <div className="RadialChart-layer3">
              <RadialChart/>
              </div>

        </div>
     
    </div>
  );
}

export default Dashboard;
