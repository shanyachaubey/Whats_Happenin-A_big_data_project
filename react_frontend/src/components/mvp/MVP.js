import React from 'react';
import Navigation from './navBar.js';
import Map from '../map/map.js';
import CalSearch from './cal_search.js';
import { LocationProvider } from '../commonUtils/Location.js';
import VantaBackground from '../background/VantaBackground';
import './MVP.css'

function MVP() {
  return (
    <div className="vanta-container">
      <VantaBackground />
      <div className="content-overlay">
        <LocationProvider>
          <Navigation />
          <Map id='map'/>
          <CalSearch />
        </LocationProvider>
      </div>
    </div>
  );
}

export default MVP;