import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const RadarChart = () => {
  const [data, setData] = useState([]);

  // Fetch data from the Flask API every 5 seconds
  useEffect(() => {
    const fetchData = () => {
      fetch("https://onsiteiq-py.onrender.com/api/metrics")
        .then((response) => response.json())
        .then((data) => {
          console.log("API Response:", data);
          if (data && data.iot_data && Array.isArray(data.iot_data.noise_data)) {
            setData(data.iot_data.noise_data); // Use noise data from the response
          } else {
            console.error("Invalid data format");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  // Render the radar chart when data changes
  useEffect(() => {
    if (data.length > 0) {
      console.log("Valid data received:", data);
      renderRadarChart(data);
    } else {
      console.warn("No data to render");
    }
  }, [data]);

  // Function to render the radar chart
  const renderRadarChart = (data) => {
    const width = 310;
    const height = 310;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = d3.select("#radar-chart");
    svg.selectAll("*").remove(); // Clear previous chart

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 1.8}, ${height / 1.8})`); // Center the chart

    const tooltip = d3
      .select("#tooltip")
      .style("position", "absolute")
      .style("display", "none")
      .style("background", "transparent")
      .style("padding", "8px 12px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "5px")
      .style("font-size", "12px")
      .style("color", "white")
      .style("pointer-events", "none")
      .style("box-shadow", "0px 2px 5px rgba(0, 0, 0, 0.2)")
      .style("z-index", "10");

    const angleScale = d3
      .scalePoint()
      .domain(data.map((d) => d.zone))
      .range([0, 2 * Math.PI]);

    const radialScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.noise_level_db)])
      .range([0, radius]);

    // Generate radial axes
    data.forEach((d) => {
      const angleValue = angleScale(d.zone);
      const x = Math.sin(angleValue) * radius;
      const y = -Math.cos(angleValue) * radius;

      // Axis lines
      g.append("line")
        .attr("class", "axis-line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "white")
        .attr("stroke-width", 1);

      // Axis labels
      g.append("text")
        .attr("class", "axis-label")
        .attr("x", x * 1.15)
        .attr("y", y * 1.15)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .style("font-size", "12px")
        .text(d.zone);
    });

    // Generate circular gridlines
    const gridLevels = 4; // You can adjust this value to change the number of gridlines

    for (let i = 1; i <= gridLevels; i++) {
      const r = (radius / gridLevels) * i;

      g.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", r)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.6); // Make the gridlines semi-transparent
    }

    // Radar area (polygon for noise levels)
    const lineGenerator = d3
      .lineRadial()
      .angle((d) => angleScale(d.zone))
      .radius((d) => radialScale(d.noise_level_db))
      .curve(d3.curveLinearClosed);

    const radarArea = g
      .append("path")
      .datum(data)
      .attr("class", "radar-area")
      .attr("fill", "#1f77b4")
      .attr("stroke", "#1f77b4")
      .attr("stroke-width", 2)
      .attr("opacity", 0.6)
      .attr("d", lineGenerator);

    // Tooltip on hover
    radarArea
      .on("mouseover", () => {
        tooltip.style("display", "block");
      })
      .on("mousemove", (event) => {
        const noiseInfo = data
          .map((d) => `<strong>${d.zone}:</strong> ${d.noise_level_db.toFixed(2)} dB`)
          .join("<br>");
        tooltip
          .html(noiseInfo)
          .style("left", `${event.pageX + 10}px`) // Offset to the right of the cursor
          .style("top", `${event.pageY - 20}px`); // Offset slightly above the cursor
      })
      .on("mouseout", () => {
        tooltip.style("display", "none");
      });
  };

  return (
    <div className="chart-container">
      {/* <h3 style={{ textAlign: "center", marginBottom: "-20px", color: "#FFF",marginTop:"10px" }}>Noise Levels by Zone</h3> */}
      <svg id="radar-chart" width={500} height={500}></svg>
      <div id="tooltip"></div>
    </div>
  );
};

export default RadarChart;
