package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Penalty struct {
	Id          string `gorm:"type:uuid;primaryKey" json:"id"`
	UserId      string `gorm:"type:varchar" json:"user_id"`
	PenaltyTime int64  `gorm:"type:bigint" json:"penalty_time"`
	CausedBy    string `gorm:"type:varchar" json:"caused_by"`
	CreatedAt   int64  `gorm:"type:bigint" json:"created_at"`
}

func (base *Penalty) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New()
	time := time.Now().UnixMilli()
	tx.Statement.SetColumn("Id", uuid)
	tx.Statement.SetColumn("CreatedAt", time)
	return nil
}
