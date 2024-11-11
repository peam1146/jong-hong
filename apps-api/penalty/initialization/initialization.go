package initialization

import (
	"encoding/json"
	"fmt"
	"jong-hong/penalty/config"
	"jong-hong/penalty/gapi"
	"jong-hong/penalty/model"
	"jong-hong/penalty/pkg/utils"
	"jong-hong/penalty/proto/penalty"
	"jong-hong/penalty/repository"
	"log"
	"net"
	"os"
	"time"

	"google.golang.org/grpc"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

// DbInit initializes the database connection using Gorm and PostgreSQL
func DbInit() (*gorm.DB, error) {
	// Database configuration
	gormConfig := &gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			SingularTable: true,
		},
	}

	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	dbname := os.Getenv("DB_NAME")
	password := os.Getenv("DB_PASSWORD")

	fmt.Println(host, port, user, dbname, password)
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s dbname=%s password=%s sslmode=disable",
		host, port, user, dbname, password,
	)

	dialect := postgres.Open(dsn)

	db, err := gorm.Open(dialect, gormConfig)
	if err != nil {
		return nil, fmt.Errorf("error opening database: %v", err.Error())
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("error getting database object: %v", err.Error())
	}

	// Configure connection pool
	sqlDB.SetMaxIdleConns(20)                  // Set max idle connections
	sqlDB.SetMaxOpenConns(100)                 // Set max open connections
	sqlDB.SetConnMaxLifetime(20 * time.Minute) // Set connection max lifetime

	return db, nil
}

// ServerInit initializes and starts the gRPC server
func ServerInit(db *gorm.DB) error {
	network := "tcp"
	address := ":" + os.Getenv("GRPC_ADDRESS")
	listener, err := net.Listen(network, address)
	if err != nil {
		return fmt.Errorf("error listening on %s: %v", address, err.Error())
	}
	defer listener.Close()

	grpcServer := grpc.NewServer()

	// Initialize repository and register gRPC service
	penaltySvc := repository.NewDataPenalty(db)
	penaltyServer := gapi.NewGrpcPenalty(penaltySvc)
	penalty.RegisterPenaltyGapiServer(grpcServer, penaltyServer)

	// Start serving gRPC
	if err := grpcServer.Serve(listener); err != nil {
		return fmt.Errorf("error serving gRPC: %v", err.Error())
	}

	return nil
}

func KafkaInit(db *gorm.DB) error {

	messageBroker := os.Getenv("MESSAGE_BROKER_URI")
	fmt.Println("messageBroker", messageBroker)
	cfg := config.KafkaConnCfg{
		Url:   messageBroker,
		Topic: "penalty.create",
	}
	conn := utils.KafkaConn(cfg)

	// messageBroker := os.Getenv("MESSAGE_BROKER_URI")
	// consumer, err := kafka.NewConsumer(&kafka.ConfigMap{
	// 	"bootstrap.servers": messageBroker,
	// 	"group.id":          "penalty",
	// 	"auto.offset.reset": "earliest",
	// })
	// if err != nil {
	// 	log.Fatalf("failed to create consumer: %v", err)
	// }

	// err = consumer.Subscribe("penalty.create", nil)
	// if err != nil {
	// 	log.Fatalf("failed to subscribe: %v", err)
	// }

	penaltySvc := repository.NewDataPenalty(db)

	log.Println("Kafka consumer is running...")
	for {
		message, err := conn.ReadMessage(10e3)
		if err != nil {
			log.Printf("Error reading Kafka message: %v", err)
			break
		}
		var penalty model.Penalty
		if err := json.Unmarshal(message.Value, &penalty); err != nil {
			log.Printf("Error unmarshalling message: %v", err)
			continue
		}

		_, err = penaltySvc.InsertPenalty(penalty)
		if err != nil {
			log.Printf("Error inserting penalty: %v", err)
			return err
		}
	}
	return nil
}
