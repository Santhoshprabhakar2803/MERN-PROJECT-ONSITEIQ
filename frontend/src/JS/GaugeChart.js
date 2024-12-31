import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const GaugeChart = () => {
  const svgRef = useRef();

  // Fetch and create chart every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("http://127.0.0.1:5000/api/metrics") // Ensure this matches your Flask API route
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // Log the fetched data to verify
          createChart(data.iot_data.air_quality_index); // Use the correct data for chart
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, 5000); // Refresh every 5 seconds

    // Cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  const createChart = (aqiValue) => {
    const aqi = Math.round(aqiValue); // Convert AQI to an integer
    const width = 400;
    const height = 300;
    const margin = 20;
    const radius = Math.min(width, height) / 2 - margin;

    const thresholds = [50, 100, 200];
    const levels = ["Good", "Moderate", "Bad"];
    const levelColors = ["#2ecc71", "#f1c40f", "#e74c3c"];

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Remove previous chart elements

    const group = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height - 50})`);

    const scale = d3
      .scaleLinear()
      .domain([0, thresholds[thresholds.length - 1]])
      .range([-Math.PI / 2, Math.PI / 2]);

    const arc = d3
      .arc()
      .innerRadius(radius - 30)
      .outerRadius(radius);

    thresholds.forEach((threshold, i) => {
      group
        .append("path")
        .datum({
          startAngle: scale(thresholds[i - 1] || 0),
          endAngle: scale(threshold),
        })
        .attr("d", arc)
        .attr("fill", levelColors[i]);
    });

    const needle = group
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", -(radius - 20))
      .attr("stroke", "#fff")
      .attr("stroke-width", "3px");

    needle
      .transition()
      .duration(1000)
      .attr("transform", `rotate(${(scale(aqi) * 180) / Math.PI})`);

    // Directly append the AQI value as text inside the chart
    group
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", 20)
      .attr("font-size", "24px")
      .attr("fill", "white")
      .text(`AQI: ${aqi}`);

    const levelIndex = thresholds.findIndex((t) => aqi <= t);
    group
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", 50)
      .attr("font-size", "18px")
      .attr("fill", "white")
      .text(`Level: ${levels[levelIndex]}`);

    // Add the title inside the chart
    svg
      .append("text")
      .attr("x", width / 2) // Center the title horizontally
      .attr("y", 50) // Position it inside the gauge area
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .text("Air Quality Index");

    // Legends inside the chart
    const legendGroup = svg
      .append("g")
      .attr("transform", `translate(${width / 2 - 150}, ${height + 20})`);

    const legendData = [
      { color: "#2ecc71", text: "Good(0-50)" },
      { color: "#f1c40f", text: "Moderate(51-100)" },
      { color: "#e74c3c", text: "Bad(101-200)" },
    ];

    legendGroup
      .selectAll("g")
      .data(legendData)
      .enter()
      .append("g")
      .attr("transform", (_, i) => `translate(${i * 120}, 0)`)
      .each(function (d) {
        const legendItem = d3.select(this);

        legendItem
          .append("circle")
          .attr("r", 10)
          .attr("fill", d.color);

        legendItem
          .append("text")
          .attr("x", 15)
          .attr("dy", "0.35em")
          .attr("fill", "white")
          .style("font-size", "10px")
          .text(d.text);
      });
  };

  return (
    <div>
      
      <svg
        ref={svgRef}
        width={400}
        height={400} // Increase height to fit both the chart and legends
        style={{ backgroundColor: "transparent" }}
      ></svg>
    </div>
  );
};

export default GaugeChart;
