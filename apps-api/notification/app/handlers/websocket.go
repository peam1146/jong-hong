package handlers

import (
	"log"
	"net/http"

	"jong-hong/notification/models"

	"github.com/gorilla/websocket"
)

// WebSocket Upgrader
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

var (
	clients   = make(map[*websocket.Conn]bool) // Connected clients
	Broadcast = make(chan models.Notification) // Channel for broadcasting messages
)

// HandleConnections handles new WebSocket requests from clients
func HandleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil) // Upgrade HTTP to WebSocket
	if err != nil {
		log.Fatal(err)
	}
	defer ws.Close() // Close the WebSocket connection when the function returns

	clients[ws] = true // Register the new client

	for {
		var msg models.Notification
		// Read a new message as JSON and map it to a Message object
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Printf("error: %v", err)
			delete(clients, ws) // Remove the client from the list if there is an error
			break
		}
		// Send the message to the broadcast channel
		Broadcast <- msg
	}
}

// HandleMessages broadcasts incoming messages to all clients
func HandleMessages() {
	log.Println("HandleMessages running")
	for {
		// Get the next message from the broadcast channel
		msg := <-Broadcast
		// Send it to every connected client
		for client := range clients {
			err := client.WriteJSON(msg) // Write message to the client
			if err != nil {
				log.Printf("error: %v", err)
				client.Close()          // Close the connection if there's an error
				delete(clients, client) // Remove the client
			}
		}
	}
}
