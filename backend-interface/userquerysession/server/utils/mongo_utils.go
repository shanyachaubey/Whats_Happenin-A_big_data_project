package utils

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/shanyachaubey/Whats_Happenin-A_big_data_project/backend-interface/userquerysession/server/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func getCollection() *mongo.Collection {
	uri := fmt.Sprintf("mongodb://root:password@mongodb-0.mongo.%s.svc.cluster.local:27017/admin", namespace)
	// local testing uri
	// uri := fmt.Sprintf("mongodb://root:password@localhost:27018/admin")
	clientOptions := options.Client().ApplyURI(uri).SetConnectTimeout(15 * time.Second)

	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatalf("Error creating MongoDB client: %v", err)
	}

	collection := client.Database("userquery").Collection("sessions")
	return collection
}

func InsertDataMongo(ctx context.Context, location string, articles interface{}) (*mongo.InsertOneResult, error) {
	// Create a struct to hold the data to insert into MongoDB
	insertData := struct {
		Location string      `bson:"location"`
		Articles interface{} `bson:"articles"`
	}{
		Location: location,
		Articles: articles,
	}

	collection := getCollection()
	res, err := collection.InsertOne(ctx, insertData)
	if err != nil {
		return nil, status.Errorf(
			codes.Internal,
			fmt.Sprintf("Internal error: %v", err),
		)
	}

	return res, nil
}

func GetID(ctx context.Context, res *mongo.InsertOneResult) (primitive.ObjectID, error) {
	oid, ok := res.InsertedID.(primitive.ObjectID)

	if !ok {
		return primitive.NilObjectID, status.Errorf(
			codes.Internal,
			"Cannot convert to OID",
		)
	}

	return oid, nil
}

func GetDataFromMongo(ctx context.Context, oid primitive.ObjectID) ([]byte, error) {
	// Filter for the document with the specified _id
	filter := bson.M{"_id": oid}

	// Find the document matching the filter
	var result models.OverallArticle
	collection := getCollection()
	err := collection.FindOne(ctx, filter).Decode(&result)
	if err != nil {
		return nil, status.Errorf(
			codes.Internal,
			fmt.Sprintf("Error finding OID from MongoDB: %v", err),
		)
	}

	// Construct output format
	output := make(map[string]interface{})
	output["data_for_bubble"] = result.DataForBubble

	var articles []map[string]string
	for _, index := range result.TopXAllCat {
		if index >= 0 && index < len(result.Articles) {
			article := result.Articles[index]
			articleMap := map[string]string{
				"rank":           fmt.Sprintf("%.2f", article.Rank),
				"location":       article.Location,
				"title":          article.Title,
				"excerpt":        article.Excerpt,
				"summary":        article.Summary,
				"link":           article.Link,
				"author":         article.Author,
				"published_date": article.PublishedDate,
				"image_link":     article.ImageLink,
				"topic":          article.Topic,
			}
			articles = append(articles, articleMap)
		}
	}
	output["articles"] = articles

	// Convert output to JSON format
	outputJSON, err := json.Marshal(output)
	if err != nil {
		log.Fatal(err)
	}

	return outputJSON, nil
}

func GetDataForTopic(ctx context.Context, oid primitive.ObjectID, topic string) ([]byte, error) {
	// Filter for the document with the specified _id
	filter := bson.M{"_id": oid}

	// Find the document matching the filter
	var result models.TopicArticle
	collection := getCollection()
	err := collection.FindOne(ctx, filter).Decode(&result)
	if err != nil {
		return nil, err
	}

	// Find the indexes corresponding to the topic
	indexes, ok := result.Top10ByCat[topic]
	if !ok {
		return nil, fmt.Errorf("topic '%s' not found", topic)
	}

	// Collect articles corresponding to the indexes
	var articles []models.Article
	for _, index := range indexes {
		if index >= 0 && index < len(result.Articles) {
			articles = append(articles, result.Articles[index])
		}
	}

	// Construct output format
	output := map[string][]models.Article{"articles": articles}

	// Convert output to JSON format
	outputJSON, err := json.Marshal(output)
	if err != nil {
		log.Fatal(err)
	}

	return outputJSON, nil
}
