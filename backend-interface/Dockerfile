FROM --platform=linux/amd64 golang:1.21.4-alpine

WORKDIR /app

# Copy go.mod and go.sum to download dependencies
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

COPY . ./

ARG NAMESPACE
ENV NAMESPACE=${NAMESPACE}

RUN go build -o grpc-server ./userquerysession/server
EXPOSE 50051

RUN chmod +x ./grpc-server

CMD ["./grpc-server"]
