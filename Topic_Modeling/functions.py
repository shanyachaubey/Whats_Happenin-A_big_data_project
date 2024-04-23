#API Modules
import requests
import creds
import json

#Text processing Modules
import string
import re
import nltk
from nltk.tokenize import RegexpTokenizer
from nltk.stem.wordnet import WordNetLemmatizer
nltk.download('punkt')
nltk.download('wordnet')
from model_loader import lda, openaiclient

#General Data processing Modules
import pandas as pd
import numpy as np
from typing import Dict, List
from collections import defaultdict

#Modules for checking for title similarity
from itertools import combinations
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Modules for topic modeling
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
import joblib
import json

from gensim.models import Phrases
from gensim.corpora import Dictionary
from gensim.models import LdaModel
from gensim.parsing.preprocessing import remove_stopwords 

# Modules for insight generation via OpenAI
import os
from dotenv import load_dotenv
from openai import OpenAI


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


def remove_url(string):
    """
    This function removes the url for topic modeling

    Args:
        string(str): Input string

    Returns:
        url_pattern.sub(''. string)(str): String without URLs
    """

    url_pattern = re.compile(r'https?://\S+|www\.\S+')

    return url_pattern.sub('', string)

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

    titles = [process_string(entry['title']) for entry in data]
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

def process_for_gensim(docs):
    """
    This function prepares the summary to be used by the 
    gensim topic model for topic modeling

    Args:
        docs (List(str)): List of all summaries of articles 
                        fetched from API call

    Returns:
        processed_doc (List(List(str))): List of List of tokens of each
                                         summary with 
                                         necessary processing done

    """


    remove_these = {
    "new york", "los angeles", "chicago", "houston", "phoenix", "philadelphia", "san antonio",
    "san diego", "dallas", "san jose", "austin", "jacksonville", "san francisco", "columbus",
    "fort worth", "indianapolis", "charlotte", "seattle", "denver", "washington", "boston",
    "el paso", "nashville", "detroit", "oklahoma city", "portland", "las vegas", "memphis",
    "louisville", "baltimore", "milwaukee", "albuquerque", "tucson", "fresno", "sacramento",
    "kansas city", "long beach", "atlanta", "omaha", "raleigh", "miami", "oakland", "minneapolis",
    "tulsa", "wichita", "arlington", "new orleans", "cleveland", "bakersfield", "tampa",
    "alabama", "alaska", "arizona", "arkansas", "california", "colorado", "connecticut",
    "delaware", "florida", "georgia", "hawaii", "idaho", "illinois", "indiana", "iowa",
    "kansas", "kentucky", "louisiana", "maine", "maryland", "massachusetts", "michigan",
    "minnesota", "mississippi", "missouri", "montana", "nebraska", "nevada", "new hampshire",
    "new jersey", "new mexico", "new york", "north carolina", "north dakota", "ohio", "oklahoma",
    "oregon", "pennsylvania", "rhode island", "south carolina", "south dakota", "tennessee",
    "texas", "utah", "vermont", "virginia", "washington", "west virginia", "wisconsin", "wyoming",
    "al", "ak", "az", "ar", "ca", "co", "ct", "de", "fl", "ga", "hi", "id", "il", "in", "ia", "ks", 
    "ky", "la", "me", "md", "ma", "mi", "mn", "ms", "mo", "mt", "ne", "nv", "nh", "nj", "nm", "ny", 
    "nc", "nd", "oh", "ok", "or", "pa", "ri", "sc", "sd", "tn", "tx", "ut", "vt", "va", "wa", "wv", "wi", "wy","it",
    "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", 
    "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", 
    "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", 
    "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", 
    "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", 
    "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", 
    "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", 
    "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", 
    "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", 
    "too", "very", "s", "t", "can", "will", "just", "don", "should", "now", "january", "february", "march", "april", 
    "may", "june", "july", "august", "september", "october", "november", "december", "jan", "feb", "mar", "apr",
    "jun", "jul", "aug", "sep", "oct", "nov", "dec", "mon", "tue", "wed", "thu", "fri", "sat", "sunday", "monday", "tuesday","wednesday",
    "thursday", "saturday", "tork","orlando","city","like","want", "going","go","think","way", "come","say","look","good","know","thing",
    "work","need", "lot", "told", "day", "today", "re", "credit", "la", "people", "feel"
    }

    tokenizer = RegexpTokenizer(r'\w+')

    for idx in range(len(docs)):
        # Convert to lowercase
        docs[idx] = docs[idx].lower()
        # Remove URLs
        docs[idx] = remove_url(docs[idx])
        # Remove stopwords
        docs[idx] = remove_stopwords(docs[idx])
        # Split into words
        docs[idx] = tokenizer.tokenize(docs[idx])

    # Remove numbers, but not words that contain numbers
    docs = [[token for token in train_summary if not token.isnumeric()] for train_summary in docs]
    #print(train_data)

    # Remove words that are only one character
    docs = [[token for token in train_summary if len(token) > 1] for train_summary in docs]
    #print(len(train_data))

    lemmatizer = WordNetLemmatizer()
    docs = [[lemmatizer.lemmatize(token) for token in train_summary] for train_summary in docs]

    # Remove all places in remove_these because city and state names are ruining the model
    docs = [[token for token in train_summary if token not in remove_these] for train_summary in docs]

    bigram = Phrases(docs, min_count = 10)
    for idx in range(len(docs)):
        for token in bigram[docs[idx]]:
            if '_' in token:
                # Token is a bigram, add it to the document
                docs[idx].append(token)
    
    return docs

def predict_category(model, new_summaries):
    """
    Predicts the category for a new summary or a 
    list of new summaries using the trained LDA model.

    Args:
        model (LdaModel): Trained LDA model.
        new_summaries (List[str] or str): New summary or list of new summaries to predict the category for.

    Returns:
        predicted_topics (List[int] or int): Predicted topic index or list of predicted topic indices for the new summaries.
    """
    dictionary = Dictionary.load('dictionary.pkl')
    topic_dictionary = {
                        0: "Community",
                        1: "Sensitive News",
                        2: "Sports",
                        3: "Business",
                        4: "Entertainment",
                        5: "Technology",
                        6: "Crime",
                        7: "Politics"
                        }
    # Processing the new summaries to prepare them for gensim
    processed_summaries = process_for_gensim(new_summaries)

    # Creating a bag of work representation of new summaries
    new_bow = [dictionary.doc2bow(summary) for summary in processed_summaries]

    #Predict the topic distribution
    predicted_topics = [max(model.get_document_topics(bow), key = lambda item: item[1])[0] for bow in new_bow]

    predicted_topics = [topic_dictionary[topic] for topic in predicted_topics]
    
    return predicted_topics

def camelcase_word(word):
    """
    This function creates a title into a title that can be displayed
    on the website

    Args:
        word (str): input word

    Returns:
        word (str): output capitalized word
    """
    if word.lower() in ['from', 'are', 'the', 'in', 'is']:
        return word.lower()
    elif word.isupper():
        return word
    else:
        return word.capitalize()

def process_title(title):
    """
    This function is made to remove non title punctuations
    makes all important words into camelcase and keeps words such as 
    for, in, the, are, is

    Args:
        title (str): The title of the articles

    Returns:
        processed_title (str): Processed Title to display on website
    """

    title = ''.join(char for char in title if ord(char)<128)

    title_words = title.split()
    processed_title = title_words[0]+' '+' '.join(camelcase_word(word) for word in title_words[1:])

    # Removing whitespace and period at the end of the sentence
    processed_title = re.sub(r'\s*\.\s*$', '', processed_title)
    processed_title = re.sub(r'\s+$', '', processed_title)

    return processed_title


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
        json_output(List(json/dict)): A list of dictionaries/json where each item is the 
                                      processed article with topic assigned and title formatted
                                      for frontend to use.
    
    """
    location = location
    processed_articles = []
    
    for item in articles:
        
        # Condition to continue to next iteration if str present
        
        regex_pattern = rf'Reporting by .{{0,50}} in {location}'
        if re.search(regex_pattern, item.summary):
            continue

        # Get title
        if item.title == None:
            continue
        title = process_title(item.title)
        
        # Get excerpt
        if item.excerpt == None:
            excerpt = "Go to Link to find out more about this article"
        else:
            excerpt = process_string(item.excerpt)
        

        processed_article = {
            "rank": int(item.rank),
            "location": location,
            "title": title,
            "excerpt": excerpt,
            "summary":item.summary,
            "link": item.link,
            "author": str(item.author),
            "published_date": item.published_date[:10],
            "image_link": item.media
        }
        
        processed_articles.append(processed_article)

    articles_json = {
        "articles": processed_articles
    }

    data = articles_json['articles']

    unique_indices = get_unique_indices(data)

    # Creating a json of only non repetitive articles
    articles_json['articles'] = [articles_json['articles'][i] for i in unique_indices]
    
    # Creating a list of summaries
    summaries = [article["summary"] for article in articles_json["articles"]]

    # Getting prediction for each summary
    predictions = predict_category(model=lda, new_summaries=summaries)

    # Assigning the article topic to each article
    for article, prediction in zip(articles_json["articles"], predictions):
        article["topic"] = prediction
    
    # Converting to parsable json
    json_output = json.dumps(articles_json, ensure_ascii=False)

    return json_output

def make_content(summaries):
    """
    This fucntion takes in the list of summaries and converts it into a message
    that can be used to prompt Open AI gpt 4 model

    Args: 
        summaries (List(str))

    Returns:
        content (str): A concatenated string which will serve as input
                       for the "content" field in "user" of messages in 
                       the OpenAI params
    """
    string1 = "Take the news articles as List of strings below and carefully find the most exciting insight out of each article in the list provided to you. The insight for each article must not be shorter than 10 tokens or longer than 20 tokens. Make the insight overly dramatic and informative. Make it so it sounds like a conversation and you're updaing them about what's happening.  Imagine you are a news anchor and informing the public about main insights out of each article. There should be no apostrophe in the string. The output must be a stings separated by \\\"^^^\\\" where each string is the insight of respective articles in input list of string. Do not put double quotes around each string The desired format is: insight1^^^insight2^^^insight3\n.\\nInput: "
    string2 = str(summaries)
    content = string1+string2
    return content



def get_insights(summaries):
    """
    This function takes in the list of summaries from top all category
    indices and top indices of each category and outputs list of strings that are insights
    based on the article summary.

    Args:
        summaries (List(str)): List of string of the entire body of the article
        client (str): Initializing OpenAI
    Returns:
        insights (List(str)): List of string of the insights from each article
    """
    response = openaiclient.chat.completions.create(
    model="gpt-4-turbo",
    messages=[
        {
        "role": "system",
        "content": "You are a news reporter who knows which information is important and are able to\
              extract the most valuable piece of information from a list of given articles. \
                You are creative, factual and do not misinterpret news and have no bias in your \
                    reporting."
        },
        {
        "role": "user",
        "content": make_content(summaries)
        }
    ],
    temperature=0.72,
    max_tokens=256,
    top_p=1,
    frequency_penalty=0.24,
    presence_penalty=0
    )

    string_response = response.choices[0].message.content

    insights = string_response.split('^^^')
    return insights

