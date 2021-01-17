# Start from recent Golang image
FROM golang:1.15.6 as build

# Use Go modules
ENV GO111MODULE=on

# SWitch to the directory we'll keep and run the beverages microservice from
WORKDIR /app

# Get and download necessary Go modules
COPY go.mod .
COPY go.sum .
RUN go mod download

# Copy necessary files
COPY . .

# Build the beverages program
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o beverages .

# Publish it on container port 8080
EXPOSE 8080

# Run the beverages microservice
CMD ["/app/beverages"]