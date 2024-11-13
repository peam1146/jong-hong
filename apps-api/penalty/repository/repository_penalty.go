package repository

import (
	"errors"
	"jong-hong/penalty/model"
	"time"

	"gorm.io/gorm"
)

type PenaltyRepositoryImpl struct {
	db *gorm.DB
}

type PenaltyRepository interface {
	InsertPenalty(penalty model.Penalty) (*model.Penalty, error)
	IsUserPenalized(userId string) error
}

func NewDataPenalty(db *gorm.DB) PenaltyRepository {
	return &PenaltyRepositoryImpl{db}
}

func (r *PenaltyRepositoryImpl) InsertPenalty(penalty model.Penalty) (*model.Penalty, error) {
	err := r.db.Create(&penalty).Error
	if err != nil {
		return nil, err
	}

	return &penalty, nil
}

func (r *PenaltyRepositoryImpl) IsUserPenalized(userId string) error {
	var penalty model.Penalty
	err := r.db.
		Model(&model.Penalty{}).
		Where("user_id = ?", userId).
		First(&penalty).
		Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return err
	}

	time := time.Now().Unix()
	if time > penalty.PenaltyTime+penalty.CreatedAt {
		err = r.DeletePenaltyById(penalty.Id)
		if err != nil {
			return err
		}
		return nil
	}
	return errors.New("user still have penalty")
}

func (r *PenaltyRepositoryImpl) DeletePenaltyById(id string) error {
	err := r.db.
		Where("id = ?", id).
		Delete(&model.Penalty{}).
		Error

	if err != nil {
		return err
	}

	return nil
}
