from fastapi import FastAPI, Query, HTTPException
from pymongo import MongoClient
from bson import ObjectId 
from pydantic import BaseModel
from typing import List, Optional
from functions import process_shrink_data
import json

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['local']
collection = db['test']
pipeline = [
    {
        '$project': {
            "id": {'$toString': "$_id"},
            "_id": 0,
            "location": 1,
            "articles": 1
        }
    }
]

# Retrieve Articles from MongoDB Collection
def get_articles_from_db():
    try:
        return list(collection.aggregate(pipeline))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Create FastAPI Endpoint
app = FastAPI()
    
@app.get("/")
async def root():
    return{"message": "API root working"}

@app.get("/favicon.ico")
async def get_favicon():
    raise HTTPException(status_code=404)

# Define Pydantic model for Article
class Article(BaseModel):
    rank: int
    title: str
    excerpt: Optional[str]=None
    summary: str
    link: str
    author: str
    published_date: str
    media: Optional[str]=None

# Function to fetch articles by ObjectId 
def get_articles_using_oid(oid: str) -> List[Article]:


    try:
        object_id = ObjectId(oid)
        article_data = collection.find_one({"_id": object_id})
        if article_data:
            articles = article_data.get('articles', [])
            # Initialize Article models from article data
            return [Article(**article) for article in articles]
        else:
            return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Function to fetch the location from MongoDB
def get_location_using_oid(oid:str) -> str:
    try:
        object_id = ObjectId(oid)
        data = collection.find_one({"_id": object_id})
        if data:
            location = data.get('location')
            return location
        else:
            return "Prateek check"
    except Exception as e:
        raise HTTPException(status_code=500, details=str(e))
    

@app.put("/articles")
async def update_mongo(oid: str = Query(..., description="Object ID of the document to fetch articles for")):
    """
    
    """
    articles = get_articles_using_oid(oid)
    location = get_location_using_oid(oid)
    articles = process_shrink_data(articles, location)
    
    try:
        articles_json = json.loads(articles)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail = "Error decoding JSON: "+ str(e))
    
    article_list = articles_json["articles"]

    topics_count = {}
    total = len(article_list)

    for article in article_list:
        topic = article.get("topic")
        if topic in topics_count:
            topics_count[topic] += 1
        else:
            topics_count[topic] = 1
    
    topics_proportion = {topic:round((count/total)*100,2) for topic, count in topics_count.items()}

    # Setting the top_x number to be able to change this later
    top_x = 24

    topics = set(article.get("topic") for article in article_list)
    top_x_all_cat = sorted(range(len(article_list)), key = lambda i: article_list[i].get("rank"))[:top_x]

    top_x_by_topics = {topic: [] for topic in topics}
    
    for topic in topics:
        articles_by_topic = [article for article in article_list if article.get("topic") == topic]
        top_x_topic = sorted(articles_by_topic, key=lambda x: x.get("rank"), reverse=False)[:top_x]
        top_x_indices = [article_list.index(article) for article in top_x_topic]
        top_x_by_topics[topic] = top_x_indices

    update_query = {
        "$set":{
            "articles":article_list,
            "top_24_all_cat": top_x_all_cat,
            "top_24_by_topics": top_x_by_topics,
            "data_for_bubble": topics_proportion
        }
    }
    collection.update_one({"_id": ObjectId(oid)}, update_query)  
    
