package main

import (
	"context"
	"log"

	pb "github.com/shanyachaubey/Whats_Happenin-A_big_data_project/backend-interface/userquerysession/proto"
)

func startSession(c pb.UserQueryServiceClient) {
	log.Println("---startSession was invoked---")

	blog := &pb.UserQuery{
		DateStart: "2024/04/01",
		DateEnd:   "2024/04/07",
		Location:  "Boulder, Colorado",
	}

	res, err := c.StartSession(context.Background(), blog)

	if err != nil {
		log.Fatalf("Unexpected error: %v\n", err)
	}

	log.Printf("Session has been created: %v\n", res)
}
