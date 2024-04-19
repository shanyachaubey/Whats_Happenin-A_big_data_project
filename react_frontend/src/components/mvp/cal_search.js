import React, { useState} from 'react';
import ModalWithDateSelection from './modalWithDateSelection.js';
//import DisplayArticleData from './modalWithDateSelection.js';
import ParentComponent from './Article_All.js';
import ArticleTopic from './Article_Topic.js';
import './styles.css';
import Bubble from '../bubble/bubble.js';
//import Loader from '../mvp/loader.js';

function CalSearch() {

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [dataSet, setDataSet] = useState(null); 
  const [bubbleData, setBubbleData] = useState({
    'Enter a location and a Date range \nto see What\'s Happenin':200});
    const [articleData, setArticleData] = useState(null);

  const [OidString, setOid] = useState('')
  const [selectedStartDate, setSelectedStartDate] = useState(''); // New state for start date
  const [selectedEndDate, setSelectedEndDate] = useState(''); // New state for end date
  const [selectedLocation, setSelectedLocation] = useState(); // New state for location
  

  const handleSubmit = (data, oidString,articleData, startDate, endDate, location) => {
    setBubbleData(data);
    setOid(oidString);
    setArticleData(articleData);
    setSelectedStartDate(startDate); // Update selected start date
    setSelectedEndDate(endDate); // Update selected end date
    setSelectedLocation(location); // Update selected location
    setDataSet(null);
  };
 
  const handleBubbleClick = (topic,dataSet) => {
    setSelectedTopic(topic);
    setDataSet(dataSet);
  };
  const renderParentComponent = () => {
    setDataSet(null);
    return <ParentComponent articles={[articleData]} />;
    
  };
console.log("Hello",selectedLocation);
  console.log("badabing:", selectedTopic, dataSet);
  console.log("cockballs", articleData);
  console.log("ballscock", bubbleData);
  
  return (
<div>
  <div className="container">
    <div className="row">
      <div className="col-md-6">
        <div id="map" style={{ width: '100%', height: '800px' }}></div>
        <div id="address"></div>
      </div>
      <div className="col-md-6" style={{ marginTop: "-40px" }}>
        <div className="row justify-content-center">
          <div className="col-md-2 d-flex justify-content-center" style={{ marginRight: '-10px' }}>
            <ModalWithDateSelection onSubmit={handleSubmit} />
        
          </div>
          <div className="col-md-6 d-flex justify-content-center" style={{ marginLeft: '-10px' }}>
            <div className="search-container">
              {/* Adding disabled attribute to make the input uneditable */}
              <input type="text" id="search-input" placeholder="See What's Happenin" className="form-control" disabled />
            </div>
          </div>
        </div>
     
        {bubbleData !== null && <Bubble prop={[bubbleData, OidString]} onBubbleClick={handleBubbleClick}  />}
      </div>
    </div>
  </div>

  <div className="container"> {/* New container for ParentComponent */}
  <div className="row justify-content-center"> {/* Center the row */}
    <div className="col-md-12"> {/* Adjust the column width */}
  
    <div className="col text-center"> {/* Center align the content */}

    {bubbleData !== null && dataSet ===null && selectedLocation &&
  <h2 style={{ color: 'white' }}>{"All Top articles in "+ selectedLocation}<br />{"From: " +selectedStartDate + " to " + selectedEndDate}</h2>
}
      {bubbleData !== null && dataSet ===null && <ParentComponent articles={[articleData]} />
}

      {dataSet!==null&& dataSet !== null && <h2 style={{ color: 'white' }}>{"Top " + selectedTopic + " articles"} in {selectedLocation}<br></br>From: {selectedStartDate} to {selectedEndDate} <button onClick={() => renderParentComponent()}>See All Articles</button></h2>}
      
      {bubbleData !== null && dataSet !==null && <ArticleTopic articles={[dataSet]} />  }
      </div>
    </div>
  </div>
</div>

</div>


  );
}


export default CalSearch;
