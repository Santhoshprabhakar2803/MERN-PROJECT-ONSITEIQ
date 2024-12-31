import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const RadialChart = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);

  // Fetch data from API and process it
  useEffect(() => {
    fetch('http://localhost:5000/api/workers')
      .then((response) => response.json())
      .then((fetchedData) => {
        // Aggregate roles into counts
        const roleCounts = fetchedData.reduce((acc, worker) => {
          acc[worker.role] = (acc[worker.role] || 0) + 1;
          return acc;
        }, {});

        // Format the data for D3.js
        const chartData = Object.entries(roleCounts).map(([role, count]) => ({
          role,
          count,
        }));

        setData(chartData);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Draw Radial Chart with D3.js
  useEffect(() => {
    if (data.length === 0) return;

    const width = 400;  // Decreased from 500 to 400
    const height = 400; // Decreased from 500 to 400
    const innerRadius = 50;  // Decreased from 50 to 40
    const outerRadius = Math.min(width, height) / 2.8 - 10; // Decreased the outer radius by increasing the offset

    // Clear previous chart (for re-renders)
    d3.select(chartRef.current).select('svg').remove();

    // Create SVG container
    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2.5 + 20}, ${height / 1.7 + 20})`);  // adds 20px of padding


      const angleScale = d3
      .scaleBand()
      .domain(data.map((d) => d.role))
      .range([0, 2 * Math.PI])
      .padding(0.1);
    
    const radiusScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)])
      .range([innerRadius, outerRadius]);

    // Define the color scale (with a predefined color scheme)
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Arc generator
    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius((d) => radiusScale(d.count))
      .cornerRadius(6)
      .startAngle((d) => angleScale(d.role))
      .endAngle((d) => angleScale(d.role) + angleScale.bandwidth())
      .padAngle(0.01)
      .padRadius(innerRadius);

    // Tooltip element
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', '#fff')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('color','black')
      .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');

    // Add arcs (each role is represented by a segment of the circle)
    svg
      .selectAll('path')
      .data(data)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => colorScale(d.role)) // Apply different color based on the role
      .style('opacity', 0)  // Start with hidden opacity for animation
      .attr('transform', 'scale(0)')  // Start with no scaling (hidden)
      .transition()
      .duration(1500)  // Duration of animation
      .style('opacity', 1)  // Fade in the arcs
      .attr('d', (d) => arc(d))  // Animate the arc shape
      .attr('transform', 'scale(1)')  // Scale to full size with a bounce effect
      .ease(d3.easeElasticOut);  // Use elastic easing for a bouncy feel

    // Add labels around the circle
const labelRadius = outerRadius + 5; // Reduced from 10 to 5
svg
  .selectAll('text')
  .data(data)
  .enter()
  .append('text')
  .attr('transform', (d) => {
    const angle = (angleScale(d.role) + angleScale.bandwidth() / 2);
    const x = labelRadius * Math.cos(angle - Math.PI / 2);
    const y = labelRadius * Math.sin(angle - Math.PI / 2);
    return `translate(${x}, ${y})`;
  })
  .attr('text-anchor', 'middle')
  .style('opacity', 0)  // Start with hidden opacity for animation
  .text((d) => `${d.role} (${d.count})`)
  .style('font-size', '10px')
  .style('fill', 'white')
  .transition()
  .duration(1200)  // Duration of label animation
  .style('opacity', 1);  // Fade in the labels

    // Add event listeners for the tooltip
svg
.selectAll('path')
.on('mouseover', (event, d) => {
  // Show tooltip on mouseover
  tooltip
    .style('visibility', 'visible')
    .html(`${d.role}: ${d.count}`) // Display in "Role: Count" format
    .transition()
    .duration(200)
    .style('opacity', 1);
})
.on('mousemove', (event) => {
  // Move tooltip with mouse position
  tooltip
    .style('top', `${event.pageY + 10}px`)
    .style('left', `${event.pageX + 10}px`);
})
.on('mouseout', () => {
  // Hide tooltip on mouseout
  tooltip
    .transition()
    .duration(200)
    .style('opacity', 0)
    .on('end', () => tooltip.style('visibility', 'hidden'));
});
  }, [data]);

  return (
    <div>
      <h3 style={{ textAlign: "center", marginBottom: "-112px", color: "#FFF",marginTop:"10px" }}>Roles Distribution</h3>
      <div ref={chartRef}></div>
    </div>
  );
};

export default RadialChart;
