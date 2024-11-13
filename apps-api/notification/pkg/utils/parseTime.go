package utils

import (
	"fmt"
	"strings"
	"time"
)

func ParseTime(dateStr string) (int64, error) {
	if len(dateStr) < 10 {
		return 0, fmt.Errorf("invalid date string: %s", dateStr)
	}

	// Remove the monotonic component
	if idx := strings.Index(dateStr, " m="); idx != -1 {
		dateStr = dateStr[:idx]
	}

	// Define the layout (without the monotonic part)
	layout := "2006-01-02 15:04:05.999999 -0700 MST"

	// Parse the time string
	parsedTime, err := time.Parse(layout, dateStr)
	if err != nil {
		fmt.Println("Error parsing time:", err)
		return 0, err
	}

	unixTime := parsedTime.Unix()
	return unixTime, err
}
