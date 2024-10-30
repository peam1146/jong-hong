package models

type NotificationType string

const (
	BeforeCheckin  NotificationType = "BEFORE_CHECKIN"
	NotCheckin     NotificationType = "NOT_CHECKIN"
	BeforeCheckout NotificationType = "BEFORE_CHECKOUT"
	NotCheckout    NotificationType = "NOT_CHECKOUT"
)

type Notification struct {
	Id       string           `json:"id"`
	Type     NotificationType `json:"type"`
	UserId   string           `json:"userId"`
	CreateAt string           `json:"CreateAt"`
}
