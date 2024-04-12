import React, { useState, useEffect } from 'react';
import ModalWithDateSelection from '../mvp/modalWithDateSelection';
import Card from '../mvp/card';

function ParentComponent() {
  const [articles, setArticles] = useState([]);

  // Fetch articles data and update state
  useEffect(() => {
    // Your code to fetch articles data and update state goes here
    // For example:
    fetchArticlesData()
      .then(data => {
        setArticles(data);
      })
      .catch(error => {
        console.error('Error fetching articles data:', error);
      });
  }, []); // Empty dependency array to run the effect only once

  // Function to fetch articles data
  const fetchArticlesData = async () => {
    // Your code to fetch articles data goes here
    // For example:
    const response = await fetch('https://api.example.com/articles');
    const data = await response.json();
    return data.articles;
  };

  // Function to handle form submission from ModalWithDateSelection
  const handleSubmit = (selectedArticles) => {
    // Handle the selected articles here
    console.log('Selected articles:', selectedArticles);
  };

  return (
    <div>
      {/* Render the ModalWithDateSelection component, passing onSubmit prop */}
      <ModalWithDateSelection onSubmit={handleSubmit} articles={articles} />
     
      {/* Render the Card component */}
      <Card articles={articles} />
    </div>
  );
}

export default ParentComponent;
