#API Modules
import requests
import creds
import json

#Text processing Modules
import string
import re
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

#General Data processing Modules
import pandas as pd
import numpy as np
from typing import Dict, List
from collections import defaultdict

#NLP Modules


#Modules for checking for title similarity
from itertools import combinations
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Modules for topic modeling
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
import joblib

def get_cities(latitude, longitude):

    """
    This function returns the names of all cities
    that fall within the latitude and longitude range
    of the map on Whats Happenin UI

    Args: 
        latitude range (float): 
        longitude range

    Returns
        city_names (List(str)): Names of all cities within 
                                the latitude, longitude range
    
    """
    
    #replace below after Justin provides input
    city_names = ['Boulder, CO', 'Longmont, CO', 'Colorado Springs, Colorado']
    return city_names

def get_unique_indices(data):
    """
    This function checks the titles of each article, compares
    the similar groups and then picks the article with the 
    best rank, in this case the lowest rank. 

    Args:
        data (json): A json value of key 'articles', with more keys like 'title', 'rank' etc
    
    Returns:
        unique_indices (List): List of all indices that have completely unique 
                                titles.

    """

    titles = [entry['title'] for entry in data]
    ranks = [entry['rank'] for entry in data]

    # Compute similarity score between titles
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(titles)
    similarity_matrix = cosine_similarity(tfidf_matrix)

    # Setting similarity threshold
    cosine_sim_threshold = 0.8

    # Identify pairs of titles with high similarity scores
    similar_titles = []
    for i,j in combinations(range(len(titles)), 2):
        similarity_score = similarity_matrix[i,j]
        if similarity_score > cosine_sim_threshold:
            similar_titles.append((i,j))
    
    indices_in_similar_titles = set([item for sublist in similar_titles for item in sublist])
    json_full_indices = set(np.arange(len(data)))
    originally_unique_indices = list(json_full_indices-indices_in_similar_titles)

    sim_articles_dict = {}

    for idx1, idx2 in similar_titles:
        sim_articles_dict.setdefault(idx1, []). append(idx2)

    similar_groups = [sorted(sim_articles_dict[key]+[key]) for key in sim_articles_dict]

    best_article_indices = []

    # Iterating over list of list  of similar indices
    for group in similar_groups:

        # Creating an array to store the ranks of each index
        ranks_in_group = []

        # Iterating over each index of the list of similar indices
        for idx in group:
            rank = ranks[idx]
            ranks_in_group.append(rank)
        best_rank_idx = np.argmin(ranks_in_group)

        best_article_indices.append(group[best_rank_idx])

    unique_indices = originally_unique_indices+best_article_indices
    
    return unique_indices


def process_string(text):

    """
    This function processing raw string by making words lowercase
    removing punctuations, removing whitespace, special characters

    Args:
        text (str): Raw input string
    
    Return:
        text (str): String with punctuations, whitespaces, special characters removed.

    """

    # Making the text lower case
    text = text.lower() 

    # Removing punctuations
    translator = str.maketrans('', '', string.punctuation)
    text = text.translate(translator)

    # Removing whitespace
    text = " ".join(text.split())

    return text


#UNCOMMENT BELOW TO USE SPACY TEXT PROCESSING

#initializing nlp object
# nlp = spacy.load(".venv\Lib\site-packages\en_core_web_sm\en_core_web_sm-3.0.0")
# sentencizer = Sentencizer()
# nlp.add_pipe('sentencizer', before = "parser")

# def process_string(raw_string):

#     """
#     Takes in raw string and makes it an nlp object
#     then returns a string that can be used for NLP

#     Args:
#         raw_string (str): Raw string
    
#     Returns:
#         process_str (str): Fully processed string
#     """
#     string_1 = str(raw_string).replace(",","")
#     doc = nlp(string_1)
#     processed_string = ' '.join([token.text \
#                                 for token in doc \
#                                 if not token.is_punct and not token.is_space])
#     return processed_string

def process_shrink_data(articles, location):
    """
    This function takes in the input that comes from a collection 
    in MongoDB. This function processes the important strings for
    each article in the document, removes any duplicate articles
    and adds a topic to each article using topic modeling model

    Arg:
        articles (List(json/dict)): A list of dictionaries/json where each json is an article
        location (str): The location used when querying to newscatcherAPI in the backend

    Returns:
        json(List(json))
    
    """
    
    # UNCOMMENT BELOW WHEN SKLEARN RESOLVED Loading the model
    lda_model = joblib.load('model.pkl')
    vectorizer = joblib.load('countvectorizer.pkl')
   

    location = location
    processed_articles = []
    for item in articles:
        
        #Condition to continue to next iteration if str present
        
        regex_pattern = rf'Reporting by .{{0,50}} in {location}'
        if re.search(regex_pattern, item.summary):
            continue

        #Get title
        title = process_string(item.title)
        
        #Get excerpt
        if item.excerpt == None:
            excerpt = "No excerpt for this article"
        else:
            excerpt = process_string(item.excerpt)
        
        #Get summary
        summary = process_string(item.summary)

        # UNCOMMENT BELOW WHEN NEEDED Getting topic, using LDA
        category_names = {
                    0: "Sports",
                    1: "Entertainment",
                    2: "Science",
                    3: "Business",
                    4: "Politics",
                    5: "Healthcare",
                    6: "Technology",
                    7: "Education"
                }
        
        text = f"{title} {summary}"
        X_test = vectorizer.transform([text])
        predicted_categories = lda_model.transform(X_test)
        category_idx = np.argmax(predicted_categories)
        topic = category_names[category_idx]
        
        processed_article = {
            "rank": int(item.rank),
            "location": location,
            "title": title,
            "excerpt": excerpt,
            "summary": summary,
            "link": item.link,
            "author": str(item.author),
            "published_date": item.published_date[:10],
            "image_link": item.media,
            "topic": topic #This will come from Niharika's model
        }
        
        processed_articles.append(processed_article)

    articles_json = {
        "articles": processed_articles
    }

    data = articles_json['articles']

    unique_indices = get_unique_indices(data)

    articles_json['articles'] = [articles_json['articles'][i] for i in unique_indices]

    #REMOVE BELOW PRINT STATEMENT WHEN DONE TESTING
    #print(len(articles_json['articles']))
    json_output = json.dumps(articles_json, ensure_ascii=False)

    return json_output


def get_top_x(data, top_x=2):
    """
    This function aggregates the articles in the same topic group
    and sorts them based on rank. Further creates a list of
    indices for top 10 articles in each category and adds
    it to the main input json

    Args: 
        data (dict): 
        The structure of input must be {"articles": [{"keys":"values"},{"keys":"values"}]}

    Returns:
        data_for_mongo (dict): 
        The structure of the output is {"articles": [{"keys":"values"},{"keys":"values"}], 
                                        "top_x_articles_in_catA":[],
                                        "top_x_articles_in_catB":[],
                                        "top_x_articles_in_catC":[]}

    """

    topics = {}
    top_10_indices = {}

    for i, article in enumerate(data["articles"]):
        topic = article.topic
        topics.setdefault(topic, []).append((i, article.rank))
    
    for topic, articles in topics.items():
        articles.sort(key=lambda x:x[1])
        top_10_indices[topic] = [article[0] for article in articles[:top_x]]

    for topic, indices in top_10_indices.items():
        data[f"top_10_topic_{topic}"] = indices

    
    data_for_mongoDB = json.dumps(data, indent=4)
    return data_for_mongoDB
