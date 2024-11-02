package main

import (
	"jong-hong/penalty/initialization"
	"jong-hong/penalty/model"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

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
	if err := initialization.ServerInit(db); err != nil {
		log.Fatalf("Failed to initialize server: %v", err)
	}
}
