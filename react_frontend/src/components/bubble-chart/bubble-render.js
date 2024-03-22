import React from 'react';
import Bubble from './bubble.js'

function BubbleRender() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div id="map" style={{ width: '100%', height: '500px' }}></div>
          <div id="address"></div>
        </div>
        <div className="col-md-6">
          <Bubble/>
        </div>
      </div>
    </div>
  );
}

export default BubbleRender;
