import React from 'react';
import './styles.css'; // Import your CSS file
import wh_logo from '../../utils/images/wh_logo.png'
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/MVP');
    }

  return (
    <section className="parallax-container">
      <header>
        <div className="logo">
          <img src={wh_logo} alt="logo" />
        </div>
      </header>
      <p className="small-paragraph">Explore. Immerse. Discover.</p>
      <p className="big-paragraph">City Insights at <br /> Your FingerTips</p>
      <p className="small-paragraph">
        Stay informed with curated news articles tailored to your city&apos;s interests. Explore local headlines and dive deep into what matters most to you.
      </p>
      <button className="button" onClick={handleButtonClick}>Start Exploring</button>
    </section>
  );
}

export default HomePage;
