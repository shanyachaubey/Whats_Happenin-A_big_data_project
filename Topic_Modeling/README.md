# Machine Learning Model Development, FastAPI development and Testing

This project uses Topic Modeling for the base functionality of the website. The goal is to intake articles from newscatcherapi, 
store them in MongoDB, then update the documents in MongoDB using FastAPI. The team uses a Gensim based LDA Topic Model to
perform topic modeling. There are two types of text processing that take place to prepare the data fro topic modeling. 

### Querying the data

The data for the project is retrieved using newscatcherAPI where the query parameter is set
to the desired location (In our case the location selected by the user on the map, start date, and end date)
More details on the specifics of the API call can be found [here](insert link here to prateek's file)

### Preparing the data

The data for the news articles that is extracted from newscatcherAPI is in JSON format and has numerous attributes related to each article. 
The ones relevant for the project's use are kept; "title", "author", "published_date", "link",
"excerpt", "summary", "rank" and "media". Issues with the data:

**1. The data contains articles that are not necessarily related to that location, but merely appears in the data because the author resides in the location in the query parameter
**2. There are numerous articles with the same content and similar titles. They are from different sources and are relevant to the date filter, hence appear in the output of the API call.

The title was processed to determine the similarity scores between all articles. Then the article titles with a similarity score over 0.8 were assessed and the one with the lowest rank (low rank = better source) was kept in the data and the indices of the rest of the duplicates were stored. Please see function ```process_title``` and ```get_unique_indices``` in ```functions.py```.

The summary of the article was processed to use a gensim lda topic model on it. Please see function ```process_for_gensim``` in ```functions.py```.

### Modeling and Assigning Topic

After the data is processed it is ready for Topic Modeling. The topic modeling takes place within ```process_shrink_data``` in ```functions.py```. 

In the aforementioned fucntion, the data is processed, duplicates are removed, only uniques articles are retained and then the topic model is used to assign topics to each article. 

### FastAPI integration

Refer to ```main.py``` for this section.

The API is used to conenct to MongoDB hosted on kubernetes through the ```mongo_uri``` variable. The major processing happens within the PUT /articles method of the API. Within ```update_mongo``` under PUT /articles, the list of articles is extracted using ```get_articles_using_oid```, the location is extracted using ```get_location_using_oid```, the articles are processed using ```process_shrink_data``` from ```functions.py```. Later the data is aggregated to get the indices of the top 24 ranked articles and this list is stored in ```top_x_all_cat```. The top 24 articles for each topic are stored in a dictionary where each key represents the topic and the list associated to each of the keys is the list of top indices for that topic. 

The MongoDB data is updated using ```$set``` and the relevant data is added to the data associated to a specific ```oid```.

### Try it yourself

To run the API locally, assuming you are in the project directory on your local machine:

**1. ```cd Topic_Modeling```
**2. Create a new virtual environment 
**3. ```pip install -r requirements.txt```
**4. Edit the ```mongodb_uri``` in ```main.py``` to point to the local host, this can look like _mongodb://localhost:27017/_
**5. Ensure you have MongoDB Compass installed and the Mongo CLI installed.
**6. Create a collection in Mongo and store test data in the collection. Ensure it is of the format: {"location": str, "articles": output of "articles" key from the output of API call from newscatcher API}
**7. Connect to the local host by opening the collection. If working on VSCode, use the mongoDB extension and connect to the local host.
**8. ```python api_call_script.py {oid}``` where oid is the ObjectID of the document in collection that you are trying to work with. 






