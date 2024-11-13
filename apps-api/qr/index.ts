// app.js

import { Kafka } from 'kafkajs'

// Configuration - Modify these as needed or use environment variables
const KAFKA_BROKERS = process.env.KAFKA_BROKERS
  ? process.env.KAFKA_BROKERS.split(',')
  : ['localhost:9092'] // Replace with your Kafka broker addresses
const KAFKA_TOPIC = process.env.KAFKA_TOPIC || 'booking.checkin' // Replace with your Kafka topic
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT ? parseInt(process.env.WEBSOCKET_PORT) : 3000 // Port for the WebSocket server

// // Set to store connected WebSocket clients
const clients = new Set()

// Initialize WebSocket server using Bun's built-in support
const server = Bun.serve({
  port: WEBSOCKET_PORT,
  websocket: {
    open(ws) {
      console.log('WebSocket connection opened')
      clients.add(ws)
    },
    message(ws, message) {
      console.log('Received message from client:', message)
    },
    close(ws) {
      console.log('WebSocket connection closed')
      clients.delete(ws)
    },
  },
  fetch(req) {
    // upgrade the request to a WebSocket
    if (
      server.upgrade(req, {
        headers: {
          'Access-Control-Allow-Origin': `*`,
        },
      })
    ) {
      return // do not return a Response
    }
    return new Response('Upgrade failed', { status: 500 })
  },
})

console.log(`WebSocket server running on ws://localhost:${WEBSOCKET_PORT}`)

// Initialize Kafka consumer
const kafka = new Kafka({
  clientId: 'bun-websocket-client',
  brokers: KAFKA_BROKERS,
})

const consumer = kafka.consumer({
  groupId: 'bun-websocket-group',
})

const runConsumer = async () => {
  try {
    await consumer.connect()
    await consumer.subscribe({
      topics: ['qrcode'],
    })

    console.log(`Subscribed to topic: ${KAFKA_TOPIC}`)

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`Received message on topic: ${topic}, partition: ${partition}`)
        const msgValue = message.value.toString()
        console.log(`Received message: ${msgValue} on topic: ${topic}`)

        // Broadcast "REFRESH" to all connected WebSocket clients
        for (const ws of clients) {
          try {
            ws.send('REFRESH')
            console.log('Sent "REFRESH" to a client')
          } catch (err) {
            console.error('Error sending message to client:', err)
          }
        }
      },
    })
  } catch (error) {
    console.error('Error running Kafka consumer:', error)
    process.exit(1)
  }
}

// Start the Kafka consumer
runConsumer()
