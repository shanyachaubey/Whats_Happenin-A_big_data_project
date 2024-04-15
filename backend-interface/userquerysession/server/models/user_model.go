package models

import (
	pb "github.com/shanyachaubey/Whats_Happenin-A_big_data_project/backend-interface/userquerysession/proto"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Query struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	StartDate string             `bson:"start_date"`
	EndDate   string             `bson:"end_date"`
	Location  string             `bson:"location"`
}

func documentToUserQuery(data *Query) *pb.UserQuery {
	return &pb.UserQuery{
		Id:        data.ID.Hex(),
		DateStart: data.StartDate,
		DateEnd:   data.EndDate,
		Location:  data.Location,
	}
}
