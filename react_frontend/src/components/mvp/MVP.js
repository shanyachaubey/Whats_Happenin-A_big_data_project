import React from 'react';
import Navigation from './navBar.js';
import Map from './map.js';
import Animal from './animal.js';
import CalSearch from './cal_search.js';
import App from '../../bubble-chart-test/src/App.js';

function MVP() {
  return (
 <div>
  <Navigation/>
<Map/>
<CalSearch/>
<Animal/>
<App/>
</div>
  );
}

export default MVP;
