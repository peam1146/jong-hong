package main

import (
	"log"
	"os"
	"time"

	"jong-hong/notification/config"
	"jong-hong/notification/models"
	"jong-hong/notification/pkg/utils"

	"github.com/joho/godotenv"
	"github.com/segmentio/kafka-go"
)

// for testing purposes
func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	messageBroker := os.Getenv("MESSAGE_BROKER_URI")
	// Connection part
	cfg := config.KafkaConnCfg{
		Url:   messageBroker,
		Topic: "notification-notify",
	}
	conn := utils.KafkaConn(cfg)

	noti := models.Notification{
		UserId:   "1",
		Type:     "Hello, WebSocket!",
		CreateAt: time.Now().String(),
	}

	// Check topic if already exists or not
	if !utils.IsTopicAlreadyExists(conn, cfg.Topic) {
		topicConfigs := []kafka.TopicConfig{
			{
				Topic:             cfg.Topic,
				NumPartitions:     1,
				ReplicationFactor: 1,
			},
		}

		err := conn.CreateTopics(topicConfigs...)
		if err != nil {
			// return fmt.Errorf("failed to create topics: %w", err)
		}
	}

	// Mock data
	data := kafka.Message{
		Value: utils.CompressToJsonBytes(noti),
	}

	// Set timeout
	conn.SetReadDeadline(time.Now().Add(10 * time.Second))
	_, err = conn.WriteMessages(data)
	if err != nil {
		// return fmt.Errorf("failed to write messages: %w", err)
	}

	// Close connection
	if err := conn.Close(); err != nil {
		// return fmt.Errorf("failed to close connection: %w", err)
	}

	// return nil
}
