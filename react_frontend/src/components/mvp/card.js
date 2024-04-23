import React from 'react';
import PropTypes from 'prop-types';

function Card({ articles }) {
    if (!articles || articles.length === 0) {
        return null; // Return null if articles is undefined or empty
    }

    return (
        <div className="container">
            <div className="row">
                {articles.map((article, index) => (
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

}

Card.propTypes = {
    articles: PropTypes.array
};
export default Card;
