BINARY_NAME=ibus-avro

all: clean build
build:
		GOOS=linux GOARCH=amd64 go build -o $(BINARY_NAME) -v
clean:
		go clean
		rm -f $(BINARY_NAME)
