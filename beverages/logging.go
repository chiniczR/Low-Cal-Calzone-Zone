package main

import (
	"time"
	"encoding/json"
	"github.com/go-kit/kit/log"
)

type loggingMiddleware struct {
	logger log.Logger
	next   BeverageService
}

func (mw loggingMiddleware) GetBeverages() (n []Beverage, err error) {
	defer func(begin time.Time) {
		a := &n
		out, err := json.Marshal(a)
		if err != nil {
			panic (err)
		}
		_ = mw.logger.Log(
			"method", "count",
			"input", string(out),
			"n", n,
			"took", time.Since(begin),
		)
	}(time.Now())

	n, err = mw.next.GetBeverages()
	return
}

func (mw loggingMiddleware) Restock() (n int, err error) {
	defer func(begin time.Time) {
		_ = mw.logger.Log(
			"method", "count",
			"n", n,
			"took", time.Since(begin),
		)
	}(time.Now())

	n, err = mw.next.Restock()
	return
}