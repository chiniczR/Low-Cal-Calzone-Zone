package main

import (
	"time"
	"strings"
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
)

type Calzone struct {
	CalzoneId	string
	Name		string
	Fillings	[]string
	Quantity	int
	Picture		string
}

type CalzoneService interface {
	GetCalzones() ([]Calzone, error)
	Restock() (int, error)
}

type calzoneService struct{}

const DB_TYPE = "mysql"
const DB_CONNECTION_STRING = "root:test@tcp(mysql:3306)/lccz"

func (calzoneService) GetCalzones() ([]Calzone, error) {
	// Establish a connection to the DB
	db, err := sql.Open(DB_TYPE, DB_CONNECTION_STRING)
	if err != nil {	return nil, err }
	db.SetConnMaxLifetime(time.Minute * 3)
	defer db.Close()

	// Get all possible calzones from the kit table
	sel, e := db.Query("SELECT kit_id, kit_name, fillings, quantity, picture FROM kit")
	if e != nil { return nil, e }
	defer sel.Close()
	var calzones []Calzone
	for sel.Next() {
		var b Calzone
		var f []byte	// Needed since the SET data type is seen as []uint8 by the MySQL driver
        err = sel.Scan(&b.CalzoneId, &b.Name, &f, &b.Quantity, &b.Picture)
		if err != nil { return nil, err }
		fillings := string(f)
		b.Fillings = strings.Split(fillings, ",")
		calzones = append(calzones, b)
	}

	// Success
	return calzones, nil
}

func (calzoneService) Restock() (int, error) {
	// Establish a connection to the DB
	db, err := sql.Open(DB_TYPE, DB_CONNECTION_STRING)
	if err != nil {	return -1, err }
	db.SetConnMaxLifetime(time.Minute * 3)
	defer db.Close()

	// Update the calzone kits inventory
	stmt, _ := db.Prepare("UPDATE kit SET quantity = 25 WHERE 1 = 1")
	// Execute
	_, e := stmt.Exec()
	if e != nil { return -1, e }

	// Success
	return 1, nil
}
