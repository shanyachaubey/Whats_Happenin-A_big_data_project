package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// TopicArticle represents the structure of the data sent for each topic.
type TopicArticle struct {
	ID         primitive.ObjectID `bson:"_id"`
	Top10ByCat map[string][]int   `bson:"top_24_by_topics"`
	Articles   []Article          `bson:"articles"`
}
