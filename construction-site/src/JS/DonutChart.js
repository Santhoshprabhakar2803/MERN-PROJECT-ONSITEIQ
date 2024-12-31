import React, { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";

const DonutChart = () => {
  const [data, setData] = useState([]);
  const chartRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    // Fetch PPE data from the API
    fetch("https://onsiteiq-server.onrender.com/get-ppe")
      .then((response) => response.json())
      .then((fetchedData) => {
        setData(fetchedData); // Set the fetched data
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const drawChart = useCallback(() => {
    const width = 450; // Increased width to accommodate legends
    const height = 400;
    const radius = Math.min(width, height) / 2 - 50; // Adjusted radius
    const innerRadius = radius * 0.6;
    const outerRadius = radius * 0.8;

    d3.select(chartRef.current).select("svg").remove();

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width) // Include space for legends
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 3}, ${height / 2})`); // Center the chart

      const color = d3.scaleSequential(d3.interpolateViridis)
      .domain([0, 10]); // Adjust domain according to your data range
  

    const pie = d3.pie().value((d) => d.value)
    .padAngle(0.05);

    const arc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(8);

    const pieData = pie(data);

    const paths = svg
      .selectAll("path")
      .data(pieData)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i));
      

    const tooltip = d3
      .select(tooltipRef.current)
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("color", "black")
      .style("padding", "5px 10px")
      .style("border-radius", "5px")
      .style("font-size", "12px");

    paths
      .on("mouseover", function (event, d) {
        tooltip.style("visibility", "visible").text(`${d.data.label}: ${d.data.value}`);
        d3.select(this).style("opacity", 0.7);
      })
      .on("mousemove", function (event) {
        tooltip.style("top", `${event.pageY + 10}px`).style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this).style("opacity", 1);
      });

    // Add legends
    const legendGroup = svg
      .append("g")
      .attr("transform", `translate(${radius + 12}, ${-height / 2 + 90})`);// Position legends to the right

    const legendItems = legendGroup
      .selectAll("g")
      .data(pieData)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(0, ${i * 25})`); // Position each legend item vertically

    // Legend color squares
    legendItems
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d, i) => color(i));

    // Legend text
    legendItems
      .append("text")
      .attr("x", 20)
      .attr("y", 12)
      .style("font-size", "12px")
      .style("fill", "white") // white text color for legends
      .text((d) => `${d.data.label}`); // Display label 
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      drawChart();
    }
  }, [data, drawChart]);

  return (
    <div>
      <h3 style={{ textAlign: "center", marginBottom: "-50px", color: "#FFF",marginTop:"80px" }}>
        PPE Distribution Overview
      </h3>
    
      <div ref={chartRef}></div>
      <div ref={tooltipRef}></div>
    </div>
  );
};

export default DonutChart;
