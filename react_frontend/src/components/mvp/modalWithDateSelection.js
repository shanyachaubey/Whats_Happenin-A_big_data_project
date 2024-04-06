import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './modalWithDateSelection.css'
import { UserQueryServiceClient } from '../../proto/userquerysession_grpc_web_pb.js'
import { UserQuery } from '../../proto/userquerysession_pb'


function ModalWithDateSelection({ onSubmit }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };


  const handleSubmit = () => {
    // Here you can perform any actions with the selected dates
    console.log('Selected Start Date:', startDate);
    console.log('Selected End Date:', endDate);

    // Your code to submit form data here
    const userQuery = new UserQuery();
    userQuery.setDateStart(startDate);
    userQuery.setDateEnd(endDate);
    userQuery.setLocation("Los Angeles, California");

    // Initialize gRPC client.
    try {
      const client = new UserQueryServiceClient('http://127.0.0.1:1337');
      console.log(client)

      client.startSession(userQuery, {}, (err, response) => {
        console.log("Request went before error");

        if (err) {
          console.error("gRPC Error: ", err.message);
          console.error("gRPC Status Code: ", err.code);
          return;
        }
        console.log("Request went after error");

        const oidString = response.array[0]
        const byteMongoData = new Uint8Array(response.array[1]);

        const byteMongoArray = Array.from(byteMongoData);
        const byteMongoString = JSON.stringify(byteMongoArray);
        const byteMongoObject = JSON.parse(byteMongoString);
        const base64String = convertTobase64encoded(byteMongoObject)
        const base64Data = JSON.parse(base64String).oidResponse
        const finalJSONString = convertToJSON(base64Data)

        console.log("Received OID data:", oidString);
        console.log("Received response data:", finalJSONString)

        const responseData = JSON.parse(finalJSONString).data_for_bubble;
        onSubmit(responseData, oidString);
      });
    } catch (error) {
      console.error('Client Error:', error.code, error.message);
    }
    setShowModal(false);
  }

  function convertTobase64encoded(jsonByteObject) {
    const decoder = new TextDecoder('utf-8');
    const decodedString = decoder.decode(new Uint8Array(jsonByteObject));

    const jsonObject = JSON.parse(decodedString);
    const base64String = JSON.stringify(jsonObject);
    return base64String;
  }

  function convertToJSON(base64Data) {
    const decodedString = atob(base64Data);
    return decodedString
  }

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ padding: '0', border: 'none', background: 'none', width: '60px', height: '60px' }}>
        <img src="https://cdn-icons-png.flaticon.com/512/1427/1427965.png" alt="Open Modal" style={{ width: '100%', height: '100%' }} />
      </button>

      {showModal && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" >Article Date Range</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="start-date">Start Date:</label>
                  <input type="date" id="start-date" className="form-control" value={startDate} onChange={handleStartDateChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="end-date">End Date:</label>
                  <input type="date" id="end-date" className="form-control" value={endDate} onChange={handleEndDateChange} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

ModalWithDateSelection.propTypes = {
  onSubmit: PropTypes.func.isRequired, // Validate onSubmit prop as a function
};

export default ModalWithDateSelection;