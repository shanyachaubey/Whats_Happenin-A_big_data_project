import React from 'react';
import Navigation from './navBar.js';
import Map from './map.js';
import Animal from './animal.js';
import App from '../bubble-chart copy/src/App.js';

function MVP() {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <Navigation />
        <Map />
        <Animal />
      </div>
      <div style={{ flex: 1 }}>
        <App />
      </div>
    </div>
  );
}

export default MVP;
