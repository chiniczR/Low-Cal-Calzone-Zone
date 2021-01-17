package main

import (
	"os"
	"encoding/json"
	"time"
	"errors"
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
	"github.com/go-kit/kit/log"
	kafka "github.com/confluentinc/confluent-kafka-go/kafka"
)

type Client struct {
	ClientId string
	Email	string `json:"email"`
	Name	string `json:"name"`
	Address	string `json:"addr"`
	Phone	string `json:"phone"`
}

type Calzone struct {
	Kit 		string		`json:"food"`
	Quantity	int			`json:"quantity"`
}

type Drink struct {
	Beverage	string	`json:"drink"`
	Quantity	int		`json:"quantity"`
}

type Order struct {
	OrderId string
	Client	Client		`json:"client"`
	Food	[]Calzone	`json:"food"`
	Drink	[]Drink		`json:"drinks"`
}

type Content struct {
	Food	[]Calzone
	Drink	[]Drink
}

type CheckoutService interface {
	PlaceOrder(Order) (string, error)
}

type checkoutService struct{}

func (checkoutService) PlaceOrder(order Order) (string, error) {
	// Define new unique IDs for the order and the client
	orderId := uuid.New().String()
	clientId := uuid.New().String()

	// Establish a connection to the DB
	db, err := sql.Open("mysql", "root:test@tcp(mysql:3306)/lccz")
	if err != nil {	return "-1", 	err }
	db.SetConnMaxLifetime(time.Minute * 3)
	defer db.Close()

	// Check if this client exists in the DB, and if they do, save their ID
	sel, e := db.Query("SELECT client_id, client_name FROM client WHERE email = ?", order.Client.Email)
	if e != nil { return "-1", e }
	defer sel.Close()
	client := Client{}
	client.Name = order.Client.Name
	for sel.Next() {
		var id string
		var name string
        err = sel.Scan(&id, &name)
        if err != nil {
            return "-1", err
        }
		client.ClientId = id
		client.Name = name
		clientId = id
	}

	// The client's name cannot be empty at this point
	if client.Name == "" {
		return "-1", errors.New("Empty client name")
	}

	// If it's a new client
	if client.ClientId == "" {
		// Prepare client insertion
		stmt, e := db.Prepare("INSERT INTO client(client_id, email, client_name, client_address, phone) VALUES (?, ?, ?, ?, ?)")
		if e != nil { return "-1", e }
		// Execute
		_, e = stmt.Exec(clientId, order.Client.Email, order.Client.Name, order.Client.Address, order.Client.Phone)
		if e != nil { return "-1", e }
	}
	
	// Prepare order insertion - has to come before we try to insert the order's contents
	stmt, e := db.Prepare("INSERT INTO ordered (client_id, order_id) VALUES (?, ?)")
	if e != nil { return "-1", e }
	// Execute
	_, e = stmt.Exec(clientId, orderId)
	if e != nil { return "-1", e }

	if len(order.Food) < 1 || len(order.Drink) < 1 {
		return "-1", errors.New("No food or drink ordered")
	}

	// Try and insert ordered calzones, if available in the quantity requested
	for _, calzone := range order.Food {
		if calzone.Quantity < 1 {
			return "-1", errors.New("Invalid calzone quantity")
		}
		calzoneId := uuid.New().String()
		// Prepare calzone insertion
		stmt, e := db.Prepare("INSERT INTO calzone (calzone_id, quantity, order_id, kit_id) VALUES (?, ?, ?, ?)")
		if e != nil { return "-1", e }
		// Execute
		_, e = stmt.Exec(calzoneId, calzone.Quantity, orderId, calzone.Kit)
		if e != nil { 
			// Prepare to cancel the order
			stmt, _ := db.Prepare("DELETE FROM ordered WHERE ordered.order_id = ?")
			// Execute
			_, e = stmt.Exec(orderId)
			return "-1", e
		}
	}

	// Try and insert ordered drinks, if available in the quantity requested
	for _, drink := range order.Drink {
		if drink.Quantity < 1 {
			return "-1", errors.New("Invalid drink quantity")
		}
		drinkId := uuid.New().String()
		// Prepare drink insertion
		stmt, e := db.Prepare("INSERT INTO drink (drink_id, quantity, order_id, beverage_id) VALUES (?, ?, ?, ?)")
		if e != nil { return "-1", e }
		// Execute
		_, e = stmt.Exec(drinkId, drink.Quantity, orderId, drink.Beverage)
		if e != nil { 
			// Prepare to cancel the order
			stmt, _ := db.Prepare("DELETE FROM ordered WHERE ordered.order_id = ?")
			// Execute
			_, e = stmt.Exec(orderId)
			return "-1", e
		}
	}

	// Initialize the Kafka producer
	p, err := kafka.NewProducer(&kafka.ConfigMap{"bootstrap.servers": "my-cluster-kafka-bootstrap:9092"})
	if err != nil {
		return "-1", err
	}

	defer p.Close()

	// Delivery report handler for produced messages
	go func() {
		logger := log.NewLogfmtLogger(os.Stderr)
		for e := range p.Events() {
			switch ev := e.(type) {
			case *kafka.Message:
				if ev.TopicPartition.Error != nil {
					logger.Log("Delivery-failed", ev.TopicPartition)
				} else {
					logger.Log("Delivered-to", ev.TopicPartition)
				}
			}
		}
	}()

	// Stringify the order's content
	c, e := json.Marshal(Content{order.Food, order.Drink})
	if e != nil { return "-1", e }
	content := string(c)

	// Produce message to topic, so that the kitchen can start preparing the order, leaving checkout free to do its thing
	topic := "kitchen"
	word := "{ \"client\": \"" + client.Name + "\", \"order_id\": \"" + orderId + "\", \"order_content\":" + content + " }"
	if content != "{Food:[] Drink:[]}" {
		p.Produce(&kafka.Message{
			TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
			Value:          []byte(word),
		}, nil)
	}

	// Wait for message deliveries before shutting down
	p.Flush(15 * 1000)

	// Success
	return orderId, nil
}
