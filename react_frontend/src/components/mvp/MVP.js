import React from 'react';
import Navigation from './navBar.js';
import Map from '../map/map.js';
import CalSearch from './cal_search.js';
import { LocationProvider } from '../commonUtils/Location.js';
import ParentComponent from '../mvp/ParentComponent.js';

function MVP() {
  return (
    <div>
      <LocationProvider>
        <div>
          <Navigation />
          <Map />
          <CalSearch />
          <ParentComponent/>
        </div>
      </LocationProvider>
    
    </div>
  );
}

export default MVP;
