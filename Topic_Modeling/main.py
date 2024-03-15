from fastapi import FastAPI, Query, HTTPException
from pymongo import MongoClient
from bson import ObjectId 
from pydantic import BaseModel
from typing import List, Optional
from functions import process_shrink_data, get_top_x

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
    excerpt: str
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

@app.get("/location")
async def get_location(oid: str = Query(..., description="Object ID of the document to fetch articles for")):
    location = get_location_using_oid(oid)
    return location


@app.get("/articles")
async def get_articles(oid: str = Query(..., description="Object ID of the document to fetch articles for")):
    articles = get_articles_using_oid(oid)
    location = get_location_using_oid(oid)
    articles = process_shrink_data(articles, location)
    #articles = get_top_x(articles,2)
    return articles
