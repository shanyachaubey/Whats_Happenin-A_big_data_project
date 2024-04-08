import React from 'react';
import Navigation from './navBar.js';
import Map from '../map/map.js';
import Animal from './animal.js';
import CalSearch from './cal_search.js';
import { LocationProvider } from '../commonUtils/Location.js';

function MVP() {
  return (
    <LocationProvider>
      <div>
        <Navigation />
        <Map />
        <CalSearch />
        <Animal />
      </div>
    </LocationProvider>
  );
}

export default MVP;
