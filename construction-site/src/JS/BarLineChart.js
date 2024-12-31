import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarLineChart = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const data = [
      { year: 2014, projectsCompleted: 10 },
      { year: 2015, projectsCompleted: 12 },
      { year: 2016, projectsCompleted: 18 },
      { year: 2017, projectsCompleted: 14 },
      { year: 2018, projectsCompleted: 20 },
      { year: 2019, projectsCompleted: 17 },
      { year: 2020, projectsCompleted: 22 },
      { year: 2021, projectsCompleted: 19 },
      { year: 2022, projectsCompleted: 25 },
      { year: 2023, projectsCompleted: 21 },
      { year: 2024, projectsCompleted: 30 },
    ];

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 330 - margin.top - margin.bottom;

    // Clear previous SVG (if any) before appending new SVG
    d3.select(svgRef.current).select('svg').remove();

    // Create the SVG element
    const svg = d3
      .select(svgRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('background-color', 'transparent')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up the x and y scales
    const x = d3
      .scaleBand()
      .domain(data.map(d => d.year))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.projectsCompleted)])
      .nice()
      .range([height, 0]);

    // Create the x-axis and y-axis
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('d')))
      .selectAll('text')
      .attr('fill', '#fff');

    svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .attr('fill', '#fff');

    // Create bars with transition
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.year))
      .attr('y', height) // Start from the bottom
      .attr('width', x.bandwidth())
      .attr('height', 0) // Start with zero height
      .attr('fill', '#69b3a2')
      .attr('opacity', 0.7)
      .transition() // Add transition
      .duration(1000) // Animation duration in ms
      .attr('y', d => y(d.projectsCompleted)) // Animate to final position
      .attr('height', d => height - y(d.projectsCompleted));

    // Create the line path with transition
    const line = d3
      .line()
      .x(d => x(d.year) + x.bandwidth() / 2)
      .y(d => y(d.projectsCompleted));

    svg.append('path')
      .data([data])
      .attr('class', 'line')
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', '#ff6347')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', function () {
        return this.getTotalLength();
      })
      .attr('stroke-dashoffset', function () {
        return this.getTotalLength();
      })
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

    // Create the tooltip
    const tooltip = d3
      .select(svgRef.current)
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.7)')
      .style('color', '#fff')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('visibility', 'hidden');

    svg.selectAll('.bar')
      .on('mouseover', function (event, d) {
        tooltip
          .style('visibility', 'visible')
          .html(`Year: ${d.year}<br/>Projects Completed: ${d.projectsCompleted}`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY + 10}px`);
      })
      .on('mousemove', function (event) {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY + 10}px`);
      })
      .on('mouseout', function () {
        tooltip.style('visibility', 'hidden');
      });
  }, []);

  return (
    <div>
      <h2 style={{ color: 'white' }}>Projects Completed Over Years</h2>
      <div ref={svgRef}></div>
    </div>
  );
};

export default BarLineChart;
