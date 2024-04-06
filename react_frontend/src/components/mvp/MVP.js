import React from 'react';
import Navigation from './navBar.js';
import Map from '../map/map.js';
import Animal from './animal.js';
import CalSearch from './cal_search.js';

function MVP() {
  return (
    <div>
      <Navigation />
      <Map />
      <CalSearch />
      <Animal />
    </div>
  );
}

export default MVP;
