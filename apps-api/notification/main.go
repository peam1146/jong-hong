package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"jong-hong/notification/app/handlers"
	"jong-hong/notification/config"
	"jong-hong/notification/models"
	"jong-hong/notification/pkg/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
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

	cfgcanceled := config.KafkaConnCfg{
		Url:   messageBroker,
		Topic: "notification-notify.canceled",
	}
	conncanceled := utils.KafkaConn(cfgcanceled)

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
			var noti models.NotificationRequest
			if err := json.Unmarshal(message.Value, &noti); err != nil {
				log.Printf("Error unmarshalling message: %v", err)
				continue
			}

			checkinUnixTime, err := utils.ParseTime(noti.CheckinTime)
			if err != nil {
				log.Printf("Error parsing time: %v", err)
				continue
			}
			checkoutUnixTime, err := utils.ParseTime(noti.CheckoutTime)
			if err != nil {
				log.Printf("Error parsing time: %v", err)
				continue
			}

			notification := models.Notification{
				UserId:       noti.UserId,
				BookingId:    noti.BookingId,
				RoomId:       noti.RoomId,
				CheckinTime:  checkinUnixTime,
				CheckoutTime: checkoutUnixTime,
			}

			// Insert notification into MongoDB
			if _, err := coll.InsertOne(context.TODO(), notification); err != nil {
				log.Printf("Error inserting to MongoDB: %v", err)
			} else {
				fmt.Println("Inserted message:", string(message.Value))
			}
		}

		if err := conn.Close(); err != nil {
			log.Printf("Failed to close Kafka connection: %v", err)
		}
	}()

	// Goroutine for Kafka message processing
	go func() {
		defer wg.Done()

		for {
			message, err := conncanceled.ReadMessage(10e3)
			if err != nil {
				log.Printf("Error reading Kafka message: %v", err)
				break
			}

			// Deserialize Kafka message to Notification struct
			var noti models.NotificationCanceledRequest
			if err := json.Unmarshal(message.Value, &noti); err != nil {
				log.Printf("Error unmarshalling message: %v", err)
				continue
			}

			// Create a filter to find the document by booking ID
			filter := bson.M{"bookingid": noti.BookingId}

			// Attempt to delete the document
			result, err := coll.DeleteOne(context.TODO(), filter)
			if err != nil {
				log.Fatalf("Error deleting document: %v", err)
			}

			// Check if a document was deleted
			if result.DeletedCount == 0 {
				fmt.Println("No document found with the specified booking ID.")
			} else {
				fmt.Println("Document deleted successfully.")
			}

		}

		if err := conn.Close(); err != nil {
			log.Printf("Failed to close Kafka connection: %v", err)
		}
	}()

	// Timer goroutine
	go func() {
		defer wg.Done()
		timerDuration := 1 * time.Second

		ticker := time.NewTicker(timerDuration)
		defer ticker.Stop()

		for range ticker.C {
			filterTime := time.Now().Unix()
			fmt.Println(filterTime)

			filter := bson.M{
				"$or": []bson.M{
					{"checkintime": filterTime + 15*60},
					{"checkouttime": filterTime + 15*60},
				},
			}

			// Query the collection with the filter
			cursor, err := coll.Find(context.TODO(), filter)
			if err != nil {
				log.Fatalf("Error finding documents: %v", err)
			}

			// Process the results
			var notifications []models.Notification
			if err = cursor.All(context.TODO(), &notifications); err != nil {
				log.Fatalf("Error decoding documents: %v", err)
			}
			cursor.Close(context.TODO())

			// Print the filtered documents
			for _, noti := range notifications {
				// Create a message to broadcast to WebSocket clients
				msg := models.Notification{
					UserId:       noti.UserId,
					RoomId:       noti.RoomId,
					Type:         noti.Type,
					CheckinTime:  noti.CheckinTime,
					CheckoutTime: noti.CheckoutTime,
				}
				fmt.Println("notifications", noti)

				// Send the message to the broadcast channel
				handlers.Broadcast <- msg
			}

			filter = bson.M{
				"$or": []bson.M{
					{"checkintime": filterTime},
					{"checkouttime": filterTime},
				},
			}

			// Query the collection with the filter
			cursor, err = coll.Find(context.TODO(), filter)
			if err != nil {
				log.Fatalf("Error finding documents: %v", err)
			}

			// Process the results
			var notificationsPenalty []models.Notification
			if err = cursor.All(context.TODO(), &notificationsPenalty); err != nil {
				log.Fatalf("Error decoding documents: %v", err)
			}

			cursor.Close(context.TODO())
			for _, noti := range notificationsPenalty {
				// Send the message to the penalty service
				unixTime := time.Now().Unix()
				sentCfg := config.KafkaConnCfg{
					Url:   messageBroker,
					Topic: "penalty.create",
				}
				handlers.SendMessage(sentCfg, models.Penalty{
					UserId:      noti.UserId,
					PenaltyTime: 604_800, // 7 days in seconds
					CausedBy:    string(noti.Type),
					CreatedAt:   unixTime,
				})
			}
		}
	}()

	// Wait for both goroutines to finish (blocking main function)
	wg.Wait()
}
