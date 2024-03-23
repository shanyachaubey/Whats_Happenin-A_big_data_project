import React, { useEffect } from 'react'; //useState
import mapboxgl from 'mapbox-gl';
import './mapstyles.css'
import './styles.css'
// import { UserQueryServiceClient } from '../../proto/userquerysession_grpc_web_pb';
// import { UserQuery } from '../../proto/userquerysession_pb';
import ModalWithDateSelection from './modalWithDateSelection.js'; // Adjust the path as needed

function Map() {
  // const [selectedCity, setSelectedCity] = useState(null);
  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(null);

  // useEffect(() => {
  //   const currentDate = new Date();
  //   const fiveYearsAgo = new Date();
  //   fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5);

  //   const startDatePicker = document.getElementById('start-date');
  //   startDatePicker.addEventListener('change', handleStartDateChange);
  //   const endDatePicker = document.getElementById('end-date');
  //   endDatePicker.addEventListener('change', handleEndDateChange);

  //   return () => {
  //     startDatePicker.removeEventListener('change', handleStartDateChange);
  //     endDatePicker.removeEventListener('change', handleEndDateChange);
  //   };
  // }, []);

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
              // else if (addressComponents[i].id.includes('country')) {
              //  country = addressComponents[i].text;
              //}
            }
            document.getElementById('search-input').value = `${city}, ${state}`; //, ${country}
            //setSelectedCity(document.getElementById('search-input').value);
          });
      }
    });

    return () => map.remove();
  }, []);

  // function handleStartDateChange(event) {
  //   const selectedDate = event.target.value;
  //   setStartDate(selectedDate);
  // }

  // function handleEndDateChange(event) {
  //   const selectedDate = event.target.value;
  //   setEndDate(selectedDate);
  // }

  // function handleSubmit() {
  //   console.log('Selected city:', selectedCity);
  //   console.log('Start date:', startDate);
  //   console.log('End date:', endDate);

  //   // Your code to submit form data here
  //   const userQuery = new UserQuery();
  //   userQuery.setDateStart(startDate);
  //   userQuery.setDateEnd(endDate);
  //   userQuery.setLocationList([selectedCity]);

  //   // Initialize gRPC client.
  //   try {
  //     const client = new UserQueryServiceClient('http://127.0.0.1:59403');
  //     console.log("Client defined");

  //     client.startSession(userQuery, {}, (err, response) => {
  //       console.log("Request went before error");

  //       if (err) {
  //         console.error("gRPC Error: ", err.message);
  //         console.error("gRPC Status Code: ", err.code);
  //         return;
  //       }
  //       console.log("Request went after error");

  //       console.log(response.array[0]);
  //     });
  //   } catch (error) {
  //     console.error('Client Error:', error.code, error.message);
  //   }
  // }
  
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
                  {/* Adding disabled attribute to make the input uneditable */}
                  <input type="text" id="search-input" placeholder="what's happenin in..." className="form-control" disabled />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default Map;