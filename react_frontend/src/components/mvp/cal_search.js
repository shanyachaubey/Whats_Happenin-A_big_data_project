import React, { useEffect } from 'react';
import ModalWithDateSelection from './modalWithDateSelection.js'; 
import './styles.css';
import App from '../../bubble-chart-test/src/App.js';

function CalSearch() {
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
      <ModalWithDateSelection />
    </div>
    <div className="col-md-6 d-flex justify-content-center" style={{ marginLeft: '-10px' }}>
      <div className="search-container">
        {/* Adding disabled attribute 
        to make the input uneditable */}
        <input type="text" id="search-input" placeholder="what's happenin in..." className="form-control" disabled />
      </div>
    </div>
  </div>
  <div style={{ marginBottom: '20px' }}></div> {/* Buffer space */}
 <App/>
</div>

        </div>
      </div>
    </div>
  );
}
export default CalSearch;