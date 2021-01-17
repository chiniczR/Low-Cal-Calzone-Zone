package main

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-kit/kit/endpoint"
)

func makeCalzoneEndpoint(svc CalzoneService) endpoint.Endpoint {
	return func(_ context.Context, request interface{}) (interface{}, error) {
		v, err := svc.GetCalzones()
		if err != nil {
			return calzoneResponse{v, err.Error()}, nil
		}
		return calzoneResponse{v, ""}, nil
	}
}

func makeRestockEndpoint(svc CalzoneService) endpoint.Endpoint {
	return func(_ context.Context, request interface{}) (interface{}, error) {
		v, err := svc.Restock()
		if err != nil {
			return restockResponse{v, err.Error()}, nil
		}
		return restockResponse{v, ""}, nil
	}
}

func decodeCalzoneRequest(_ context.Context, r *http.Request) (interface{}, error) {
	var request calzoneRequest
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

type calzoneRequest struct{}

type calzoneResponse struct {
	B 	[]Calzone	`json:"calzones"`
	Err string 		`json:"err,omitempty"`
}

type restockRequest struct{}

type restockResponse struct {
	V 	int			`json:"v"`
	Err string 		`json:"err,omitempty"`
}
