package models

type NotificationType string

const (
	BeforeCheckin  NotificationType = "BEFORE_CHECKIN"
	NotCheckin     NotificationType = "NOT_CHECKIN"
	BeforeCheckout NotificationType = "BEFORE_CHECKOUT"
	NotCheckout    NotificationType = "NOT_CHECKOUT"
)

type Notification struct {
	Type     NotificationType `json:"type"`
	UserId   string           `json:"userId"`
	RoomId   string           `json:"roomId"`
	CreateAt string           `json:"CreateAt"`
}
