package models

type Notification struct {
	Id       string `json:"id"`
	Type     string `json:"type"`
	UserId   string `json:"userId"`
	CreateAt string `json:"CreateAt"`
}
