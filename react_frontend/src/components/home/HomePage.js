import React from 'react';
import './homePageStyles.css'; // Import your CSS file
//import wh_logo from '../../utils/images/wh_logo.png'
import { useNavigate } from "react-router-dom";
import Navigation from '../mvp/navBar.js'

function HomePage() {
  const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/MVP');
    }

  return (
    <><header>
      <div><Navigation /></div>
    </header>
    <section className="parallax-container">
        <div className="text-container">
          <p className="small-paragraph">Explore. Immerse. Discover.</p>
          <p className="big-paragraph">City Insights at <br />Your Fingertips</p>
          <p className="small-paragraph">
            Stay informed with curated news articles tailored to your city&apos;s interests. Explore local headlines and dive deep into what matters most to you.
          </p>
          <button className="button" onClick={handleButtonClick}>Start Exploring</button>
          <p className="smaller-paragraph">
            Powered by: <a href="https://www.newscatcherapi.com/" target="_blank" rel="noopener noreferrer">{'</newscatcher>'}</a>
          </p>
        </div>
      </section></>
  );
}

export default HomePage;
