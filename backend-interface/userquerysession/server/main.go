package main

import (
	"log"
	"net"
	"os"
	"time"

	pb "github.com/shanyachaubey/Whats_Happenin-A_big_data_project/backend-interface/userquerysession/proto"
	"github.com/shanyachaubey/Whats_Happenin-A_big_data_project/backend-interface/userquerysession/server/utils"
	"google.golang.org/grpc"
	"google.golang.org/grpc/keepalive"
	"google.golang.org/grpc/reflection"
)

var addr string = ":50051"

func main() {
	log.Printf("Server is starting")

	lis, err := net.Listen("tcp", addr)

	if err != nil {
		log.Fatalf("Failed to listen: %v\n", err)
	}

	log.Printf("Listening at %s\n", addr)

	namespace := os.Getenv("NAMESPACE")
	if namespace == "" {
		log.Printf("Namespace environment variable is not set")
		os.Exit(1)
	}

	log.Printf("Namespace defined as: %s", namespace)
	utils.SetNamespace(namespace)

	s := grpc.NewServer(
		grpc.ConnectionTimeout(20*time.Second),
		grpc.KeepaliveParams(keepalive.ServerParameters{
			MaxConnectionIdle: 25 * time.Second,
		}),
	)

	pb.RegisterUserQueryServiceServer(s, &Server{})
	reflection.Register(s)

	if err := s.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v\n", err)
	}
}
