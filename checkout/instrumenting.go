package main

import (
	"time"

	"github.com/go-kit/kit/metrics"
)

type instrumentingMiddleware struct {
	requestCount   metrics.Counter
	requestLatency metrics.Histogram
	countResult    metrics.Histogram
	next           CheckoutService
}

func (mw instrumentingMiddleware) PlaceOrder(o Order) (n string, err error) {
	defer func(begin time.Time) {
		lvs := []string{"method", "order", "error", "false"}
		mw.requestCount.With(lvs...).Add(1)
		mw.requestLatency.With(lvs...).Observe(time.Since(begin).Seconds())
	}(time.Now())

	n, err = mw.next.PlaceOrder(o)
	return
}
