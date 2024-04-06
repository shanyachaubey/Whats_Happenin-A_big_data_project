import React, { useState } from 'react';
import ModalWithDateSelection from './modalWithDateSelection.js';
import './styles.css';
import Bubble from '../bubble/bubble.js';

function CalSearch() {
  const [bubbleData, setBubbleData] = useState({
    'Texas': 10,
    'Portland': 10,
    'Ranch': 10
  });

  const [OidString, setOid] = useState('')

  const handleSubmit = (data, oidString) => {
    setBubbleData(data);
    setOid(oidString);
  };

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
            {bubbleData !== null && <Bubble prop={[bubbleData, OidString]} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalSearch;
