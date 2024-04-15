import React, { useState } from 'react';
import ModalWithDateSelection from './modalWithDateSelection.js';
//import DisplayArticleData from './modalWithDateSelection.js';
import ParentComponent from './Article_All.js';
import ArticleTopic from './Article_Topic.js';
import './styles.css';
import Bubble from '../bubble/bubble.js';

function CalSearch() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [dataSet, setDataSet] = useState(null); 
  const [bubbleData, setBubbleData] = useState({
    'Texas': 10,
    'Portland': 10,
    'Ranch': 10
  });
  const [articleData, setArticleData] = useState({
   'blaaaaa': 10
  });
  const [OidString, setOid] = useState('')

  const handleSubmit = (data, oidString,articleData) => {
    setBubbleData(data);
    setOid(oidString);
    setArticleData(articleData);
  };
  const handleBubbleClick = (topic,dataSet) => {
    setSelectedTopic(topic);
    setDataSet(dataSet);
  };
  console.log("badabing:", selectedTopic, dataSet);
  console.log("cockballs", articleData);
  return (
<div>
  <div className="container">
    <div className="row">
      <div className="col-md-6">
        <div id="map" style={{ width: '100%', height: '800px' }}></div>
        <div id="address"></div>
      </div>
      <div className="col-md-6">
        <div className="row justify-content-center">
          <div className="col-md-2 d-flex justify-content-center" style={{ marginRight: '-10px' }}>
            <ModalWithDateSelection onSubmit={handleSubmit} />
          </div>
          <div className="col-md-6 d-flex justify-content-center" style={{ marginLeft: '-10px' }}>
            <div className="search-container">
              {/* Adding disabled attribute to make the input uneditable */}
              <input type="text" id="search-input" placeholder="what's happenin in..." className="form-control" disabled />
            </div>
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}></div> {/* Buffer space */}
        {bubbleData !== null && <Bubble prop={[bubbleData, OidString]} onBubbleClick={handleBubbleClick}  />}
      </div>
    </div>
  </div>

  <div className="container"> {/* New container for ParentComponent */}
  <div className="row justify-content-center"> {/* Center the row */}
    <div className="col-md-12"> {/* Adjust the column width */}
    <div className="col text-center"> {/* Center align the content */}
    {bubbleData !== null && dataSet===null&& <h2>All Top articles</h2>}
                        </div>
     
      {bubbleData !== null && dataSet ===null && <ParentComponent articles={[articleData]} />}
      <div className="col text-center"> {/* Center align the content */}
      {dataSet!==null&&  <h2>{"Top " + selectedTopic + " articles"}</h2>}
                        </div>
  
      {bubbleData !== null && dataSet !==null && <ArticleTopic articles={[dataSet]} />}
    </div>
  </div>
</div>

</div>


  );
}


export default CalSearch;
