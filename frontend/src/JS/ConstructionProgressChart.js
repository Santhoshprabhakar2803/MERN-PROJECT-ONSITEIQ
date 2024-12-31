import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const ConstructionProgressChart = ({ steps, currentStatus }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const progressData = steps.map((step, index) => ({
      step,
      completed: index <= steps.indexOf(currentStatus) ? 1 : 0, // 1 for completed, 0 for pending
    }));

    const data = {
      labels: progressData.map((step) => step.step), // Step names
      datasets: [
        {
          label: "Construction Progress",
          data: progressData.map((step) => step.completed), // 1 or 0
          backgroundColor: progressData.map((step) =>
            step.completed ? "green" : "lightgray"
          ),
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false, // Allow the chart to scale freely
      plugins: {
        legend: {
          display: false, // Hide legend
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Construction Steps",
          },
        },
        y: {
          ticks: {
            stepSize: 1,
          },
          min: 0,
          max: 1, // Progress is either 0 (not completed) or 1 (completed)
          title: {
            display: true,
            text: "Completion (0 or 1)",
          },
        },
      },
    };

    // Cleanup any existing chart instance before creating a new one
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data,
      options,
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [steps, currentStatus]);

  return (
    <div
      style={{
        width: "700px",
        height: "400px", // Set the chart frame size
        margin: "0 auto", // Center the chart horizontally
      }}
    >
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ConstructionProgressChart;
