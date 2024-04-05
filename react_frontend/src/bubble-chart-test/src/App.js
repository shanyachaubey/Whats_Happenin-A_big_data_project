import React from 'react';
import BubbleChart from './BubbleChart'; 
import './bubblestyle.css';


const App = () => {
  // Figure out a  way to get data from mvp/mapmodalwithselection.js into here
  // The data format will look like {'data_for_bubble': {'Education': 90, 'Sports': 10}}
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
    // Get the label value from the function parameter.
    // Get the oid from the mvvp/mapmodal.js file.
    // Use the above two parameters to call the backend api and store the response,
    // in a json variable for the frontend to render according to the decided styles.
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