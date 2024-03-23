#LDA variable its taking as new_labeled_data

from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import CountVectorizer
import json
import numpy as np
import joblib

# Load Existing and New Labeled Data
with open('existing_dataset.json', 'r', encoding='utf-8') as f:

    existing_data = json.load(f)

new_labeled_data = []


# Combine Datasets
combined_data = existing_data + new_labeled_data

# Preprocessing
texts = [sample['title'] + ' ' + sample['summary'] for sample in combined_data]
print(texts)

# Vectorize the text data
vectorizer = CountVectorizer()

X = vectorizer.fit_transform(texts)

joblib.dump(vectorizer, 'countvectorizer.pkl')

# Topic Modeling with LDA
lda = LatentDirichletAllocation(n_components=8, random_state=42)  # Assuming 8 categories
lda.fit(X)

# Prediction
predicted_categories = lda.transform(X)

# Print predicted categories for data
print("Predicted categories:")
for idx, (title, summary, pred_category) in enumerate(zip([sample['title'] for sample in combined_data], 
                                                          [sample['summary'] for sample in combined_data], 
                                                          predicted_categories)):
    category_idx = np.argmax(pred_category)
    #print(f"Title: {title}\nSummary: {summary}\nPredicted Category Index: {category_idx}\n")



#This is just for clarity 
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

# Print predicted categories for data
print("Predicted categories:")
for title, summary, pred_category in zip([sample['title'] for sample in combined_data], 
                                         [sample['summary'] for sample in combined_data], 
                                         predicted_categories):
    category_idx = np.argmax(pred_category)
    category_name = category_names[category_idx]
    #print(f"Title: {title}\nSummary: {summary}\nPredicted Category: {category_name}\n")

    
    # Print predicted categories for data in the index
print("Predicted categories:")
for idx, (title, summary, pred_category) in enumerate(zip([sample['title'] for sample in combined_data], 
                                                          [sample['summary'] for sample in combined_data], 
                                                          predicted_categories)):
    category_idx = np.argmax(pred_category)
    category_name = category_names[category_idx]
    print(f"{idx + 1}: {category_name}")

    




#PERCENTAGE OF LDA
# Calculate the percentage of each category
category_counts = {category_names[i]: 0 for i in range(len(category_names))}
total_predictions = len(predicted_categories)

for pred_category in predicted_categories:
    category_idx = np.argmax(pred_category)
    category_name = category_names[category_idx]
    category_counts[category_name] += 1

# Print percentage of each category
print("Percentage of each category:")
for category, count in category_counts.items():
    percentage = (count / total_predictions) * 100
    print(f"{category}: {percentage:.2f}%")

joblib.dump(lda, 'model.pkl')    

joblib.dump(lda, 'lda_model.jl')
