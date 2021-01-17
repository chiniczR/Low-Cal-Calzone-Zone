package main

import (
	"time"
	"encoding/json"
	"github.com/go-kit/kit/log"
)

type loggingMiddleware struct {
	logger log.Logger
	next   CheckoutService
}

func (mw loggingMiddleware) PlaceOrder(o Order) (n string, err error) {
	defer func(begin time.Time) {
		a := &o
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

	n, err = mw.next.PlaceOrder(o)
	return
}
