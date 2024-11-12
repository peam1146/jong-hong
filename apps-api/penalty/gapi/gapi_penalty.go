package gapi

import (
	"context"
	"jong-hong/penalty/model"
	pb "jong-hong/penalty/proto/penalty"
	"jong-hong/penalty/repository"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type PenaltyGapi struct {
	pb.UnimplementedPenaltyGapiServer
	repository repository.PenaltyRepository
}

func NewGrpcPenalty(repo repository.PenaltyRepository) *PenaltyGapi {
	return &PenaltyGapi{repository: repo}
}

func (s *PenaltyGapi) InsertPenalty(ctx context.Context, input *pb.InsertPenaltyRequest) (*pb.InsertPenaltyResponse, error) {
	data := model.Penalty{
		UserId:      input.UserId,
		PenaltyTime: input.PenaltyTime,
		CausedBy:    input.CausedBy,
	}

	penalty, err := s.repository.InsertPenalty(data)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	resp := pb.InsertPenaltyResponse{
		Meta: &pb.Meta{
			Code:    200,
			Message: "Success",
		},
		Data: &pb.PenaltyDBResponse{
			Id:          penalty.Id,
			UserId:      penalty.UserId,
			PenaltyTime: penalty.PenaltyTime,
			CausedBy:    penalty.CausedBy,
			CreatedAt:   penalty.CreatedAt,
		},
	}

	return &resp, nil
}

func (s *PenaltyGapi) IsUserPenalized(ctx context.Context, input *pb.IsUserPenalizedRequest) (*pb.IsUserPenalizedResponse, error) {
	if input.UserId == "" {
		return nil, status.Error(codes.InvalidArgument, "user id is empty")
	}

	err := s.repository.IsUserPenalized(input.UserId)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	result := pb.IsUserPenalizedResponse{
		Meta: &pb.Meta{
			Code:    200,
			Message: "Success",
		},
	}

	return &result, nil
}
