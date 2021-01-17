package main

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-kit/kit/endpoint"
)

func makeBeverageEndpoint(svc BeverageService) endpoint.Endpoint {
	return func(_ context.Context, request interface{}) (interface{}, error) {
		v, err := svc.GetBeverages()
		if err != nil {
			return beverageResponse{v, err.Error()}, nil
		}
		return beverageResponse{v, ""}, nil
	}
}

func makeRestockEndpoint(svc BeverageService) endpoint.Endpoint {
	return func(_ context.Context, request interface{}) (interface{}, error) {
		v, err := svc.Restock()
		if err != nil {
			return restockResponse{v, err.Error()}, nil
		}
		return restockResponse{v, ""}, nil
	}
}

func decodeBeverageRequest(_ context.Context, r *http.Request) (interface{}, error) {
	var request beverageRequest
	return request, nil
}

func decodeRestockRequest(_ context.Context, r *http.Request) (interface{}, error) {
	var request restockRequest
	return request, nil
}

func encodeResponse(_ context.Context, w http.ResponseWriter, response interface{}) error {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	return json.NewEncoder(w).Encode(response)
}

type beverageRequest struct{}

type beverageResponse struct {
	B 	[]Beverage	`json:"beverages"`
	Err string 		`json:"err,omitempty"`
}

type restockRequest struct{}

type restockResponse struct {
	V 	int			`json:"v"`
	Err string 		`json:"err,omitempty"`
}