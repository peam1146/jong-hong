package models

type Penalty struct {
	UserId      string `json:"user_id"`
	PenaltyTime int64  `json:"penalty_time"`
	CausedBy    string `json:"caused_by"`
	CreatedAt   int64  `json:"created_at"`
}
