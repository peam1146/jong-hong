package handlers

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	"jong-hong/notification/models"

	"github.com/gorilla/websocket"
)

// WebSocket Upgrader
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

var (
	clients   = make(map[string]map[*websocket.Conn]bool) // Connected clients by userId
	Broadcast = make(chan models.Notification)            // Channel for broadcasting messages
)

// HandleConnections handles new WebSocket requests from clients
func HandleConnections(w http.ResponseWriter, r *http.Request) {
	// Parse the userId from the URL path
	urlPath := strings.TrimPrefix(r.URL.Path, "/ws/")
	userId := urlPath

	fmt.Println("userId:", userId)

	if userId == "" {
		http.Error(w, "Missing userId in URL", http.StatusBadRequest)
		return
	}

	// Upgrade HTTP to WebSocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer ws.Close() // Close the WebSocket connection when the function returns

	// Register the new client under the specified userId
	if clients[userId] == nil {
		clients[userId] = make(map[*websocket.Conn]bool)
	}
	clients[userId][ws] = true

	for {
		var msg models.Notification
		// Read a new message as JSON and map it to a Notification object
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Printf("error: %v", err)
			delete(clients[userId], ws) // Remove the client from the list if there is an error
			break
		}
		// Attach the userId to the message and send it to the broadcast channel
		fmt.Println("Received message:", msg)
		msg.UserId = userId
		Broadcast <- msg
	}
}

// HandleMessages broadcasts incoming messages to all clients of a specific userId
func HandleMessages() {
	log.Println("HandleMessages running")
	for {
		// Get the next message from the broadcast channel
		msg := <-Broadcast
		userId := msg.UserId // Target userId for the message

		// Send the message to every connected client for the userId
		if clients[userId] != nil {
			for client := range clients[userId] {
				err := client.WriteJSON(msg) // Write message to the client
				if err != nil {
					log.Printf("error: %v", err)
					client.Close()                  // Close the connection if there's an error
					delete(clients[userId], client) // Remove the client
				}
			}
		}
	}
}
