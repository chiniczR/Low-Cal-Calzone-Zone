package main

import (
	"context"
	"encoding/json"
	"net/http"
	"github.com/go-kit/kit/endpoint"
)

func makeOrderEndpoint(svc CheckoutService) endpoint.Endpoint {
	return func(_ context.Context, request interface{}) (interface{}, error) {
		req := request.(orderRequest)
		v, err := svc.PlaceOrder(req.O)
		if err != nil {
			return orderResponse{v, err.Error()}, nil
		}
		return orderResponse{v, ""}, nil
	}
}

func decodeOrderRequest(_ context.Context, r *http.Request) (interface{}, error) {
	var request orderRequest
	if r.Method == "POST" {
		if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
			return nil, err
		}
	}
	return request, nil
}

func encodeResponse(_ context.Context, w http.ResponseWriter, response interface{}) error {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "*")
	return json.NewEncoder(w).Encode(response)
}

type orderRequest struct {
	O Order `json:"o"`
}

type orderResponse struct {
	V string `json:"v"`
	Err string `json:"err,omitempty"`
}
