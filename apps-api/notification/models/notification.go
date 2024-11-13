package models

type NotificationType string

const (
	BeforeCheckin  NotificationType = "BEFORE_CHECKIN"
	NotCheckin     NotificationType = "NOT_CHECKIN"
	BeforeCheckout NotificationType = "BEFORE_CHECKOUT"
	NotCheckout    NotificationType = "NOT_CHECKOUT"
)

type NotificationRequest struct {
	UserId       string `json:"userId"`
	BookingId    string `json:"bookingId"`
	RoomId       string `json:"roomId"`
	CheckinTime  string `json:"CheckinTime"`
	CheckoutTime string `json:"CheckoutTime"`
}

type NotificationCanceledRequest struct {
	BookingId string `json:"bookingId"`
}

type Notification struct {
	Type         NotificationType `json:"type"`
	UserId       string           `json:"userId"`
	BookingId    string           `json:"bookingId"`
	RoomId       string           `json:"roomId"`
	CheckinTime  int64            `json:"CheckinTime"`
	CheckoutTime int64            `json:"CheckoutTime"`
	// CreateAt string           `json:"CreateAt"`
}
