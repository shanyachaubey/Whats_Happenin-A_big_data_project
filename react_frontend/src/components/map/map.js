import { useEffect } from 'react'; //useState
import mapboxgl from 'mapbox-gl';
import './mapstyles.css'
import '../mvp/styles.css'
import { useLocation } from '../commonUtils/Location.js'

function Map() {
  const { setLocation } = useLocation();

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiamFtcm93c2tpIiwiYSI6ImNsbzd3ampoMjA4Y3Aybm8zbHdqNDYxMmQifQ.Dl3WZ3jX4FKgS40ge9Je7Q';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-105.2705, 40.0150],
      zoom: 9
    });

    let marker = null;

    map.on('click', (e) => {
      if (marker) {
        marker.remove();
        marker = null;
        document.getElementById('address').innerText = '';
      } else {
        marker = new mapboxgl.Marker()
          .setLngLat(e.lngLat)
          .addTo(map);

        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?access_token=${mapboxgl.accessToken}`)
          .then(response => response.json())
          .then(data => {
            let city, state; //, country;
            const addressComponents = data.features[0].context;
            for (let i = 0; i < addressComponents.length; i++) {
              if (addressComponents[i].id.includes('place')) {
                city = addressComponents[i].text;
              } else if (addressComponents[i].id.includes('region')) {
                state = addressComponents[i].text;
              }
            }
            document.getElementById('search-input').value = `${city}, ${state}`; //, ${country}
            setLocation(document.getElementById('search-input').value)
          });
      }
    });

    return () => map.remove();
  }, [setLocation]);

}

export default Map;
