dev:
	goreload

start:
	go run main.go

start-producer:
	go run app/producer/main.go $(userId)

compose-up:
	docker-compose up -d

format:
	gofumpt -l -w .
