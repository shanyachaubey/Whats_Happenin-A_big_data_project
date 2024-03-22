import React from 'react';
import Navigation from './navBar.js'
import Map from './map.js'
import Animal from './animal.js'
import Bubble from '../bubble-chart/bubble-render.js'

function MVP() {
  return (
    <div>
      <div><Navigation/></div>
      <div><Map/></div>
      <div><Bubble/></div>
      <div><Animal/></div>
    </div>
  );
}

export default MVP;
