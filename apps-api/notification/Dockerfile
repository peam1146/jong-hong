# Stage 1: Build the Go application
FROM golang:1.23 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum to leverage Docker layer caching
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the application's source code
COPY . .

# Build the Go application
RUN go build -o main .

# Expose the application port (adjust if necessary)
EXPOSE 8000

# Run the executable
CMD ["./main"]