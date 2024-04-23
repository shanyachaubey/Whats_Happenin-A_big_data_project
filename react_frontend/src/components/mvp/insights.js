import React from 'react';
import PropTypes from 'prop-types';

function Insights({ stuff }) {
  // Check if 'stuff' is an object and has the 'insightsData' property
  if (stuff && stuff.insightsData && Array.isArray(stuff.insightsData)) {
    // If 'stuff' is valid and contains 'insightsData', render each item in the array
    return (
      <div>
        {stuff.insightsData.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    );
  } else {
    // If 'stuff' is invalid or doesn't contain 'insightsData', render a message
    return <div>Invalid data</div>;
  }
}

Insights.propTypes = {
  stuff: PropTypes.shape({
    insightsData: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
  }).isRequired
};

export default Insights;
