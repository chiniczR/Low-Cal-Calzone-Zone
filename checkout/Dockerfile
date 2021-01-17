# Start Golnag Alpine image
FROM golang:alpine as build

# Switch to directory we'll use to keep and run the checkout microservice from
WORKDIR /go/src/app

# Set necessary environmet variables needed for our image
ENV GOOS=linux GOARCH=amd64 

# Copy necessary files
COPY . .

# Install necesary components to run a Kafka client
RUN apk update && apk add gcc librdkafka-dev openssl-libs-static zlib-static zstd-libs libsasl librdkafka-static lz4-dev lz4-static zstd-static libc-dev musl-dev 
RUN go build -tags musl -ldflags '-w -extldflags "-static"' -o checkout

# Use scratch image to run
FROM scratch

# Build checkout program
COPY --from=build /go/src/app/checkout /

# Command to run the executable
ENTRYPOINT ["/checkout"]