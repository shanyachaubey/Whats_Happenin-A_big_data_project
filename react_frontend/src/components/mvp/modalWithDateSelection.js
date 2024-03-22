import React, { useState } from 'react';
import './modalWithDateSelection.css'

function ModalWithDateSelection() {
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

    // Close the modal
    setShowModal(false);
  };

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

export default ModalWithDateSelection;
