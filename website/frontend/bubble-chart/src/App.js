import React from 'react';
import BubbleChart from './BubbleChart'; 
import './bubblestyle.css';


const App = () => {
  const bubbleChartData = [
    { label: 'Sports', value: 100, color: 'red' },
    { label: 'Health', value: 200, color: 'blue' },
    { label: 'BingBong', value: 150, color: 'green' },
   
  ];

  const handleBubbleClick = (label) => {
    console.log(`Bubble ${label} is clicked`);
    // Scroll to a new section on the same page when a bubble is clicked
    const element = document.getElementById('containers'); // Specify the ID of the new section
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the new section
    }
  };



  const handleLegendClick = (label) => {
    console.log(`Legend ${label} is clicked`);
   
  };

  return (
    <div>
      <BubbleChart
        data={bubbleChartData}
        bubbleClickFun={handleBubbleClick}
        legendClickFun={handleLegendClick}
      />
    </div>
  );
};

export default App;