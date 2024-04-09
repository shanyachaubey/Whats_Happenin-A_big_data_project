package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	pb "github.com/shanyachaubey/Whats_Happenin-A_big_data_project/backend-interface/userquerysession/proto"
	utils "github.com/shanyachaubey/Whats_Happenin-A_big_data_project/backend-interface/userquerysession/server/utils"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (server *Server) StartSession(ctx context.Context, uq *pb.UserQuery) (*pb.UserID, error) {
	log.Printf("StartSession was invoked with %v\n", uq)

	newsCatcherParam := []string{uq.DateStart, uq.DateEnd, uq.Location}

	articles, err := utils.FetchDataFromAPI(newsCatcherParam)
	if err != nil {
		return nil, status.Errorf(
			codes.Internal,
			fmt.Sprintf("Error fetching data from Newscatcher API: %v", err),
		)
	}

	res, err := utils.InsertDataMongo(ctx, uq.Location, articles)
	if err != nil {
		return nil, err
	}

	oid, err := utils.GetID(ctx, res)
	if err != nil {
		return nil, err
	}

	log.Printf("Oid is: %v", oid)

	_, err = utils.MakePythonPipelineRequest(oid.Hex())
	if err != nil {
		return nil, err
	}

	log.Printf("Session started with Id: %v", oid)

	mongoJsonString, err := server.SendOverallResponse(ctx, &pb.OverallRequest{Oid: oid.Hex()})
	if err != nil {
		return nil, err
	}

	mongoJSON, err := json.Marshal(mongoJsonString)
	if err != nil {
		return nil, err
	}

	return &pb.UserID{Id: oid.Hex(), Overallresponse: mongoJSON}, status.Error(codes.OK, "Session started successfully")
}

func (server *Server) SendOverallResponse(ctx context.Context, oidData *pb.OverallRequest) (*pb.OverallResponse, error) {
	// Parse ObjectID from string
	oid, err := primitive.ObjectIDFromHex(oidData.Oid)
	if err != nil {
		log.Fatal(err)
	}

	// Call the function with the parsed ObjectID
	outputJSON, err := utils.GetDataFromMongo(context.Background(), oid)
	if err != nil {
		return nil, status.Errorf(
			codes.Internal,
			fmt.Sprintf("Error fetching data from MongoDB: %v", err),
		)
	}

	return &pb.OverallResponse{OidResponse: outputJSON}, nil
}

func (server *Server) SendTopicResponse(ctx context.Context, topicData *pb.TopicRequest) (*pb.TopicResponse, error) {
	// Parse ObjectID from string
	oid, err := primitive.ObjectIDFromHex(topicData.Oid)
	if err != nil {
		log.Fatal(err)
	}

	// Call the function with the parsed ObjectID
	outputJSON, err := utils.GetDataForTopic(context.Background(), oid, topicData.Topic)
	if err != nil {
		return nil, status.Errorf(
			codes.Internal,
			fmt.Sprintf("Error fetching data from MongoDB: %v", err),
		)
	}

	return &pb.TopicResponse{ArticlesResponse: outputJSON}, nil
}

// articles := Articles{
// 	{
// 		Rank:          9196,
// 		Location:      "Chicago, IL",
// 		Title:         "The Doobie Brothers to play Chicago area show this August",
// 		Excerpt:       "The Doobie Brothers will perform in Tinley Park this summer as part of a national tour across 38 cities",
// 		Summary:       "article The Doobie Brothers will perform in Tinley Park this summer as part of a national tour across 38 cities The Grammy winning rockers will play a show with special guest Steve Winwood at Credit Union 1 Amphitheatre on Sunday Aug. 24 General tickets go on sale Friday at 10 a.m. with a limited number of VIP packages available Citi cardmembers will be eligible to buy presale tickets at 10 a.m. Tuesday The Doobie Brothers 2024 tour schedule Sat June 15 Seattle WA White River Amphitheater Sun June 16 RidgefieldWA RV Inn Style Resorts Amphitheater Tues June 18 Bend OR Hayden Homes Amphitheater Thurs June 20 Wheatland CA Toyota Amphitheatre Sat June 22 Concord CA Concord Pavilion Sun June 23 Los Angeles CA The Kia Forum Tues June 25 San Diego CA North Island Credit Union Amphitheatre We d. June 26 Phoenix AZ Footprint Center Sat June 29 Dallas TX Dos Equis Pavilion Sun June 30 The Woodlands TX Cynthia Woods Mitchell Pavilion Tues July 2 Tulsa OK BOK Center We d. July 3 Durant OK Choctaw Casino and Resort Sat July 6 Rogers AR Walmart AMP Mon July 8 Jacksonville FL Daily 's Place We d. July 10 West Palm Beach FL iTHINK Financial Amphitheatre Thurs July 11 Tampa FL MIDFLORIDA Credit Union Amphitheatre Sat July 13 Alpharetta GA Ameris Bank Amphitheatre Sun July 14 Knoxville TN Thompson Boling Arena Tues July 30 Charlotte NC PNC Music Pavilion We d. July 31 Raleigh NC Coastal Credit Union Music Park Sat August 3 Camden NJ Freedom Mortgage Pavilion Sun August 4 Bristow VA Jiffy Lube Live Tues August 6 Holmdel NJ PNC Bank Arts Center We d. August 7 New York NY Madison Square Garden Fri August 9 Bridgeport CT Hartford Care Amphitheater Sat August 10 Gilford NH BankNH Pavilion Mon August 12 Mansfield MA Xfinity Center Tues August 13 Saratoga Springs NY Broadview Stage at SPAC Thurs August 15 Clarkston MI Pine Knob Music Theatre Sat August 17 Noblesville IN Ruoff Music Center Sun August 18 Cincinnati OH Riverbend Music Center Tues August 20 Burgettstown PA The Pavilion at Star Lake Thurs August 22 Cuyahoga Falls OH Blossom Music Center Sat August 24 St. Louis MO Hollywood Casino Amphitheatre Sun August 25 Tinley Park IL Credit Union 1 Amphitheatre Tues August 27 Omaha NE CHI Center Thurs August 29 Denver CO Ball Arena Fri August 30 Salt Lake City UT USANA Amphitheater",
// 		Link:          "https://www.fox32chicago.com/news/the-doobie-brothers-chicago-2024",
// 		Author:        "Fox Digital Staff",
// 		PublishedDate: "2024-01-22",
// 		ImageLink:     "https://images.foxtv.com/static.fox32chicago.com/www.fox32chicago.com/content/uploads/2024/01/1280/720/GettyImages-1741990951.jpg?ve=1&tl=1",
// 		Topic:         "Government",
// 	},
// }
