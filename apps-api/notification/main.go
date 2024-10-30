package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"

	"jong-hong/notification/app/handlers"
	"jong-hong/notification/config"
	"jong-hong/notification/models"
	"jong-hong/notification/pkg/utils"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	docs := "www.mongodb.com/docs/drivers/go/current/"
	mongoUri := os.Getenv("MONGODB_URI")
	if mongoUri == "" {
		log.Fatal("Set your 'MONGODB_URI' environment variable. " +
			"See: " + docs +
			"usage-examples/#environment-variable")
	}

	messageBroker := os.Getenv("MESSAGE_BROKER_URI")
	cfg := config.KafkaConnCfg{
		Url:   messageBroker,
		Topic: "notification-notify",
	}
	conn := utils.KafkaConn(cfg)

	// MongoDB client
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(mongoUri))
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			log.Fatalf("Failed to disconnect MongoDB: %v", err)
		}
	}()

	// Collection reference
	coll := client.Database("notification").Collection("logs")

	var wg sync.WaitGroup
	wg.Add(2) // We have two goroutines

	// Goroutine for HTTP server
	go func() {
		defer wg.Done()

		// uncomment this if you want to test the WebSocket server
		fs := http.FileServer(http.Dir("./public"))
		http.Handle("/", fs)

		http.HandleFunc("/ws/", handlers.HandleConnections)

		log.Println("HTTP server started on :8000")
		if err := http.ListenAndServe(":8000", nil); err != nil {
			log.Fatalf("HTTP server error: %v", err)
		}
	}()

	// Start the message broadcasting goroutine
	go handlers.HandleMessages() // Start handling messages

	// Goroutine for Kafka message processing
	go func() {
		defer wg.Done()

		for {
			message, err := conn.ReadMessage(10e3)
			if err != nil {
				log.Printf("Error reading Kafka message: %v", err)
				break
			}

			// Deserialize Kafka message to Notification struct
			var noti models.Notification
			if err := json.Unmarshal(message.Value, &noti); err != nil {
				log.Printf("Error unmarshalling message: %v", err)
				continue
			}

			// Insert notification into MongoDB
			if _, err := coll.InsertOne(context.TODO(), noti); err != nil {
				log.Printf("Error inserting to MongoDB: %v", err)
			} else {
				fmt.Println("Inserted message:", string(message.Value))

				// Create a message to broadcast to WebSocket clients
				msg := models.Notification{
					UserId:   noti.UserId,
					RoomId:   noti.RoomId,
					Type:     noti.Type,
					CreateAt: noti.CreateAt,
				}

				// Send the message to the broadcast channel
				handlers.Broadcast <- msg
			}
		}

		if err := conn.Close(); err != nil {
			log.Printf("Failed to close Kafka connection: %v", err)
		}
	}()

	// Wait for both goroutines to finish (blocking main function)
	wg.Wait()
}
