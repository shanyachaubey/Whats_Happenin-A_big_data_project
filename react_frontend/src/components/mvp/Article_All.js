import React from 'react';
//import ModalWithDateSelection from './modalWithDateSelection.js';
//import ModalWithDateSelection from '../mvp/modalWithDateSelection';
//import { DisplayArticleData } from '../mvp/modalWithDateSelection';
//import DisplayArticleData from '../bubble/bubble' 
//import ModalWithDateSelection from './modalWithDateSelection.js';
import './Article.css'
function ParentComponent(article) {


  // Conditionally render based on the return value of DisplayArticleData
  if (article && Array.isArray(article.articles) && article.articles.length > 0 && Array.isArray(article.articles[0])) {
    // Access the inner array
    const innerArray = article.articles[0];

    return (
      <div className="container">
        <div className="row row-cols-1 row-cols-md-3">
          {innerArray.map((article, index) => (
            <div className="col mb-4" key={index}>
              <div className="card h-100 d-flex flex-column">
                <img src={article.image_link} className="card-img-top equal-image-size" alt="Article Thumbnail" />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text">{article.excerpt}</p>
                  <p className="card-text-author">Author: {article.author}</p>
                  <p className="card-text-topic">Topic: {article.topic}</p>
                  <a href={article.link} className="mt-auto btn btn-primary">Read more</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    );
  } else {
    return (
      <div>

      </div>
    );
  }
}

export default ParentComponent;
