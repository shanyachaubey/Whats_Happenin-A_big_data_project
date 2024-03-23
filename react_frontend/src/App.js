import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './components/home/HomePage.js';
import AboutUSPage from './components/about/AboutUSPage';
import MVP from './components/mvp/MVP';

function App() {
  return (
    <Router>
        <Routes>
        <Route exact path="/" element={<HomePage/>} />
        <Route exact path="/MVP" element={<MVP/>} />
        <Route exact path="/About_US" element={<AboutUSPage/>} />
        </Routes>
    </Router>
  );
}

export default App;