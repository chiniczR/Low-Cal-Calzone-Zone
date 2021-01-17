package main

import (
	"time"
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
)

type Beverage struct {
	BeverageId	string
	Name		string
	Quantity	int
	Picture		string
}

type BeverageService interface {
	GetBeverages() ([]Beverage, error)
	Restock() (int, error)
}

type beverageService struct{}

const DB_TYPE = "mysql"
const DB_CONNECTION_STRING = "root:test@tcp(mysql:3306)/lccz"

func (beverageService) GetBeverages() ([]Beverage, error) {
	// Establish a connection to the DB
	db, err := sql.Open(DB_TYPE, DB_CONNECTION_STRING)
	if err != nil {	return nil, err }
	db.SetConnMaxLifetime(time.Minute * 3)
	defer db.Close()

	// Get all beverages
	sel, e := db.Query("SELECT beverage_id, beverage_name, quantity, picture FROM beverage")
	if e != nil { return nil, e }
	defer sel.Close()
	var beverages []Beverage
	for sel.Next() {
		var b Beverage
        err = sel.Scan(&b.BeverageId, &b.Name, &b.Quantity, &b.Picture)
        if err != nil { return nil, err }
		beverages = append(beverages, b)
	}

	// Success
	return beverages, nil
}

func (beverageService) Restock() (int, error) {
	// Establish a connection to the DB
	db, err := sql.Open(DB_TYPE, DB_CONNECTION_STRING)
	if err != nil {	return -1, err }
	db.SetConnMaxLifetime(time.Minute * 3)
	defer db.Close()

	// Update the beverages inventory
	stmt, _ := db.Prepare("UPDATE beverage SET quantity = 25 WHERE 1 = 1")
	// Execute
	_, e := stmt.Exec()
	if e != nil { return -1, e }

	// Success
	return 1, nil
}