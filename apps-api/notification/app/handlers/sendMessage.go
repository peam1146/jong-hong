package handlers

import (
	"encoding/json"
	"jong-hong/notification/config"
	"jong-hong/notification/pkg/utils"

	"github.com/segmentio/kafka-go"
)

func SendMessage(cfg config.KafkaConnCfg, message interface{}) error {
	// Establish Kafka connection
	conn := utils.KafkaConn(cfg)
	defer conn.Close() // Ensure the connection is closed after sending the message

	// Serialize the message to JSON or your preferred format
	messageBytes, err := json.Marshal(message)
	if err != nil {
		return err
	}

	// Write the message to the specified topic
	_, err = conn.WriteMessages(kafka.Message{
		Topic: cfg.Topic,
		Value: messageBytes,
	})

	return err
}
