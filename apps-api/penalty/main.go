package main

import (
	"jong-hong/penalty/initialization"
	"jong-hong/penalty/model"
	"log"
	"sync"
)

func main() {

	var wg sync.WaitGroup
	wg.Add(2)

	// Initialize connection to DB
	db, err := initialization.DbInit()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Run auto-migration for the Penalty model
	if err := db.AutoMigrate(&model.Penalty{}); err != nil {
		log.Fatalf("Failed to auto-migrate Penalty model: %v", err)
	}

	// Initialize and start the gRPC server
	// Note: The process will not continue beyond this point
	go func() {
		defer wg.Done()
		if err := initialization.ServerInit(db); err != nil {
			log.Fatalf("Failed to initialize gRPC server: %v", err)
		}
	}()

	go func() {
		defer wg.Done()
		if err := initialization.KafkaInit(db); err != nil {
			log.Fatalf("Failed to initialize Kafka server: %v", err)
		}
	}()

	wg.Wait()
}
