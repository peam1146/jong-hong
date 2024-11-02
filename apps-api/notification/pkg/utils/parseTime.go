package utils

import (
	"fmt"
	"time"
)

func ParseTime(dateStr string) (int64, error) {
	// Define the layout that matches the date string format
	layout := "2006-01-02 15:04:05.999999999 -0700"

	// Parse the date string
	parsedTime, err := time.Parse(layout, dateStr[:len(dateStr)-19]) // Ignore the last part
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return 0, err
	}

	// Convert to Unix timestamp in milliseconds
	unixTimeMillis := parsedTime.UnixNano() / int64(time.Millisecond)
	return unixTimeMillis, err
}
