package main

import (
	"time"

	"github.com/go-kit/kit/metrics"
)

type instrumentingMiddleware struct {
	requestCount   metrics.Counter
	requestLatency metrics.Histogram
	countResult    metrics.Histogram
	next           CalzoneService
}

func (mw instrumentingMiddleware) GetCalzones() (n []Calzone, err error) {
	defer func(begin time.Time) {
		lvs := []string{"method", "calzone", "error", "false"}
		mw.requestCount.With(lvs...).Add(1)
		mw.requestLatency.With(lvs...).Observe(time.Since(begin).Seconds())
	}(time.Now())

	n, err = mw.next.GetCalzones()
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