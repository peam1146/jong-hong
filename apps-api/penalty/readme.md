to generate proto gen file in /proto/penalty path
`protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative penalty.proto`