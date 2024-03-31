package models

type Article struct {
	Rank          int    `bson:"rank"`
	Location      string `bson:"location"`
	Title         string `bson:"title"`
	Excerpt       string `bson:"excerpt"`
	Summary       string `bson:"summary"`
	Link          string `bson:"link"`
	Author        string `bson:"author"`
	PublishedDate string `bson:"published_date"`
	ImageLink     string `bson:"image_link"`
	Topic         string `bson:"topic"`
}

type Articles []Article
