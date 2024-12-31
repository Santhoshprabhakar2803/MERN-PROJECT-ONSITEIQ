import React from "react";
import { Bar } from "react-chartjs-2";

const ConstructionProgressChart = ({ steps, currentStatus }) => {
  // Determine progress for each step
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

  return (
    <div
      style={{
        width: "700px",
        height: "400px", // Set the chart frame size
        margin: "0 auto", // Center the chart horizontally
      }}
    >
      <Bar data={data} options={options} />
    </div>
  );
};

export default ConstructionProgressChart;
