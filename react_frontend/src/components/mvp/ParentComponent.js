import React from 'react';
//import ModalWithDateSelection from '../mvp/modalWithDateSelection';
//import { DisplayArticleData } from '../mvp/modalWithDateSelection';
//import DisplayArticleData from '../bubble/bubble' 

  let count = 0;
function ParentComponent(article) {
  count++;
    console.log(count);
console.log("check1check2", article);
    // Call DisplayArticleData to get its return value
 

    // Conditionally render based on the return value of DisplayArticleData
    if (article && Array.isArray(article.articles) && article.articles.length > 0 && Array.isArray(article.articles[0])) {
      console.log("badbing");

      // Access the inner array
      const innerArray = article.articles[0];

      return (
          <div className="container">
              <div className="row">
                  {innerArray.map((article, index) => (
                      <div className="col-md-4" key={index}>
                          <div className="card">
                              <img src={article.image_link} className="card-img-top" alt="Article Thumbnail" />
                              <div className="card-body">
                                  <h5 className="card-title">{article.title}</h5>
                                  <p className="card-text">{article.excerpt}</p>
                                  <p className="card-text">Author: {article.author}</p>
                                  <p className="card-text">Rank: {article.rank}</p>
                                  <p className="card-text">Topic: {article.topic}</p>
                                  <a href={article.link} className="btn btn-primary">Read more</a>
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
              Count: {count}
          </div>
      );
  }
}

export default ParentComponent;
