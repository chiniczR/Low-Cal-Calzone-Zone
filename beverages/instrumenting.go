package main

import (
	"time"

	"github.com/go-kit/kit/metrics"
)

type instrumentingMiddleware struct {
	requestCount   metrics.Counter
	requestLatency metrics.Histogram
	countResult    metrics.Histogram
	next           BeverageService
}

func (mw instrumentingMiddleware) GetBeverages() (n []Beverage, err error) {
	defer func(begin time.Time) {
		lvs := []string{"method", "beverage", "error", "false"}
		mw.requestCount.With(lvs...).Add(1)
		mw.requestLatency.With(lvs...).Observe(time.Since(begin).Seconds())
	}(time.Now())

	n, err = mw.next.GetBeverages()
	return
}

func (mw instrumentingMiddleware) Restock() (n int, err error) {
	defer func(begin time.Time) {
		lvs := []string{"method", "restock", "error", "false"}
		mw.requestCount.With(lvs...).Add(1)
		mw.requestLatency.With(lvs...).Observe(time.Since(begin).Seconds())
	}(time.Now())

	n, err = mw.next.Restock()
	return
}