// protocol buffers version 3

// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.35.1
// 	protoc        v5.28.2
// source: penalty.proto

// define package name or namespace

package penalty

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

// Define message of protocol buffer
// This structure Looks Like JSON
type Meta struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// field named as code
	// with datatype as int32
	// and tag number 1, used to match fields
	// when serialize or deserialize the data
	Code int32 `protobuf:"varint,1,opt,name=code,proto3" json:"code,omitempty"`
	// field named as message
	// with datatype as string
	// and tag number 2, used to match fields
	// when serialize or deserialize the data
	Message string `protobuf:"bytes,2,opt,name=message,proto3" json:"message,omitempty"`
}

func (x *Meta) Reset() {
	*x = Meta{}
	mi := &file_penalty_proto_msgTypes[0]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *Meta) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Meta) ProtoMessage() {}

func (x *Meta) ProtoReflect() protoreflect.Message {
	mi := &file_penalty_proto_msgTypes[0]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Meta.ProtoReflect.Descriptor instead.
func (*Meta) Descriptor() ([]byte, []int) {
	return file_penalty_proto_rawDescGZIP(), []int{0}
}

func (x *Meta) GetCode() int32 {
	if x != nil {
		return x.Code
	}
	return 0
}

func (x *Meta) GetMessage() string {
	if x != nil {
		return x.Message
	}
	return ""
}

type PenaltyDBResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Id          string `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	UserId      string `protobuf:"bytes,2,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
	PenaltyTime int64  `protobuf:"varint,3,opt,name=penalty_time,json=penaltyTime,proto3" json:"penalty_time,omitempty"`
	CausedBy    string `protobuf:"bytes,4,opt,name=caused_by,json=causedBy,proto3" json:"caused_by,omitempty"`
	CreatedAt   int64  `protobuf:"varint,5,opt,name=created_at,json=createdAt,proto3" json:"created_at,omitempty"`
}

func (x *PenaltyDBResponse) Reset() {
	*x = PenaltyDBResponse{}
	mi := &file_penalty_proto_msgTypes[1]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *PenaltyDBResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*PenaltyDBResponse) ProtoMessage() {}

func (x *PenaltyDBResponse) ProtoReflect() protoreflect.Message {
	mi := &file_penalty_proto_msgTypes[1]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use PenaltyDBResponse.ProtoReflect.Descriptor instead.
func (*PenaltyDBResponse) Descriptor() ([]byte, []int) {
	return file_penalty_proto_rawDescGZIP(), []int{1}
}

func (x *PenaltyDBResponse) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *PenaltyDBResponse) GetUserId() string {
	if x != nil {
		return x.UserId
	}
	return ""
}

func (x *PenaltyDBResponse) GetPenaltyTime() int64 {
	if x != nil {
		return x.PenaltyTime
	}
	return 0
}

func (x *PenaltyDBResponse) GetCausedBy() string {
	if x != nil {
		return x.CausedBy
	}
	return ""
}

func (x *PenaltyDBResponse) GetCreatedAt() int64 {
	if x != nil {
		return x.CreatedAt
	}
	return 0
}

type InsertPenaltyRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	UserId      string `protobuf:"bytes,1,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
	PenaltyTime int64  `protobuf:"varint,2,opt,name=penalty_time,json=penaltyTime,proto3" json:"penalty_time,omitempty"`
	CausedBy    string `protobuf:"bytes,3,opt,name=caused_by,json=causedBy,proto3" json:"caused_by,omitempty"`
}

func (x *InsertPenaltyRequest) Reset() {
	*x = InsertPenaltyRequest{}
	mi := &file_penalty_proto_msgTypes[2]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *InsertPenaltyRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*InsertPenaltyRequest) ProtoMessage() {}

func (x *InsertPenaltyRequest) ProtoReflect() protoreflect.Message {
	mi := &file_penalty_proto_msgTypes[2]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use InsertPenaltyRequest.ProtoReflect.Descriptor instead.
func (*InsertPenaltyRequest) Descriptor() ([]byte, []int) {
	return file_penalty_proto_rawDescGZIP(), []int{2}
}

func (x *InsertPenaltyRequest) GetUserId() string {
	if x != nil {
		return x.UserId
	}
	return ""
}

func (x *InsertPenaltyRequest) GetPenaltyTime() int64 {
	if x != nil {
		return x.PenaltyTime
	}
	return 0
}

func (x *InsertPenaltyRequest) GetCausedBy() string {
	if x != nil {
		return x.CausedBy
	}
	return ""
}

type InsertPenaltyResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Meta *Meta              `protobuf:"bytes,1,opt,name=meta,proto3" json:"meta,omitempty"`
	Data *PenaltyDBResponse `protobuf:"bytes,2,opt,name=data,proto3" json:"data,omitempty"`
}

func (x *InsertPenaltyResponse) Reset() {
	*x = InsertPenaltyResponse{}
	mi := &file_penalty_proto_msgTypes[3]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *InsertPenaltyResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*InsertPenaltyResponse) ProtoMessage() {}

func (x *InsertPenaltyResponse) ProtoReflect() protoreflect.Message {
	mi := &file_penalty_proto_msgTypes[3]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use InsertPenaltyResponse.ProtoReflect.Descriptor instead.
func (*InsertPenaltyResponse) Descriptor() ([]byte, []int) {
	return file_penalty_proto_rawDescGZIP(), []int{3}
}

func (x *InsertPenaltyResponse) GetMeta() *Meta {
	if x != nil {
		return x.Meta
	}
	return nil
}

func (x *InsertPenaltyResponse) GetData() *PenaltyDBResponse {
	if x != nil {
		return x.Data
	}
	return nil
}

type IsUserPenalizedRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	UserId string `protobuf:"bytes,1,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
}

func (x *IsUserPenalizedRequest) Reset() {
	*x = IsUserPenalizedRequest{}
	mi := &file_penalty_proto_msgTypes[4]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *IsUserPenalizedRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*IsUserPenalizedRequest) ProtoMessage() {}

func (x *IsUserPenalizedRequest) ProtoReflect() protoreflect.Message {
	mi := &file_penalty_proto_msgTypes[4]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use IsUserPenalizedRequest.ProtoReflect.Descriptor instead.
func (*IsUserPenalizedRequest) Descriptor() ([]byte, []int) {
	return file_penalty_proto_rawDescGZIP(), []int{4}
}

func (x *IsUserPenalizedRequest) GetUserId() string {
	if x != nil {
		return x.UserId
	}
	return ""
}

type IsUserPenalizedResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Meta *Meta `protobuf:"bytes,1,opt,name=meta,proto3" json:"meta,omitempty"`
}

func (x *IsUserPenalizedResponse) Reset() {
	*x = IsUserPenalizedResponse{}
	mi := &file_penalty_proto_msgTypes[5]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *IsUserPenalizedResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*IsUserPenalizedResponse) ProtoMessage() {}

func (x *IsUserPenalizedResponse) ProtoReflect() protoreflect.Message {
	mi := &file_penalty_proto_msgTypes[5]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use IsUserPenalizedResponse.ProtoReflect.Descriptor instead.
func (*IsUserPenalizedResponse) Descriptor() ([]byte, []int) {
	return file_penalty_proto_rawDescGZIP(), []int{5}
}

func (x *IsUserPenalizedResponse) GetMeta() *Meta {
	if x != nil {
		return x.Meta
	}
	return nil
}

var File_penalty_proto protoreflect.FileDescriptor

var file_penalty_proto_rawDesc = []byte{
	0x0a, 0x0d, 0x70, 0x65, 0x6e, 0x61, 0x6c, 0x74, 0x79, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12,
	0x07, 0x70, 0x65, 0x6e, 0x61, 0x6c, 0x74, 0x79, 0x22, 0x34, 0x0a, 0x04, 0x4d, 0x65, 0x74, 0x61,
	0x12, 0x12, 0x0a, 0x04, 0x63, 0x6f, 0x64, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x05, 0x52, 0x04,
	0x63, 0x6f, 0x64, 0x65, 0x12, 0x18, 0x0a, 0x07, 0x6d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x18,
	0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x07, 0x6d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x22, 0x9b,
	0x01, 0x0a, 0x11, 0x50, 0x65, 0x6e, 0x61, 0x6c, 0x74, 0x79, 0x44, 0x42, 0x52, 0x65, 0x73, 0x70,
	0x6f, 0x6e, 0x73, 0x65, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x02, 0x69, 0x64, 0x12, 0x17, 0x0a, 0x07, 0x75, 0x73, 0x65, 0x72, 0x5f, 0x69, 0x64, 0x18,
	0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x06, 0x75, 0x73, 0x65, 0x72, 0x49, 0x64, 0x12, 0x21, 0x0a,
	0x0c, 0x70, 0x65, 0x6e, 0x61, 0x6c, 0x74, 0x79, 0x5f, 0x74, 0x69, 0x6d, 0x65, 0x18, 0x03, 0x20,
	0x01, 0x28, 0x03, 0x52, 0x0b, 0x70, 0x65, 0x6e, 0x61, 0x6c, 0x74, 0x79, 0x54, 0x69, 0x6d, 0x65,
	0x12, 0x1b, 0x0a, 0x09, 0x63, 0x61, 0x75, 0x73, 0x65, 0x64, 0x5f, 0x62, 0x79, 0x18, 0x04, 0x20,
	0x01, 0x28, 0x09, 0x52, 0x08, 0x63, 0x61, 0x75, 0x73, 0x65, 0x64, 0x42, 0x79, 0x12, 0x1d, 0x0a,
	0x0a, 0x63, 0x72, 0x65, 0x61, 0x74, 0x65, 0x64, 0x5f, 0x61, 0x74, 0x18, 0x05, 0x20, 0x01, 0x28,
	0x03, 0x52, 0x09, 0x63, 0x72, 0x65, 0x61, 0x74, 0x65, 0x64, 0x41, 0x74, 0x22, 0x6f, 0x0a, 0x14,
	0x49, 0x6e, 0x73, 0x65, 0x72, 0x74, 0x50, 0x65, 0x6e, 0x61, 0x6c, 0x74, 0x79, 0x52, 0x65, 0x71,
	0x75, 0x65, 0x73, 0x74, 0x12, 0x17, 0x0a, 0x07, 0x75, 0x73, 0x65, 0x72, 0x5f, 0x69, 0x64, 0x18,
	0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x06, 0x75, 0x73, 0x65, 0x72, 0x49, 0x64, 0x12, 0x21, 0x0a,
	0x0c, 0x70, 0x65, 0x6e, 0x61, 0x6c, 0x74, 0x79, 0x5f, 0x74, 0x69, 0x6d, 0x65, 0x18, 0x02, 0x20,
	0x01, 0x28, 0x03, 0x52, 0x0b, 0x70, 0x65, 0x6e, 0x61, 0x6c, 0x74, 0x79, 0x54, 0x69, 0x6d, 0x65,
	0x12, 0x1b, 0x0a, 0x09, 0x63, 0x61, 0x75, 0x73, 0x65, 0x64, 0x5f, 0x62, 0x79, 0x18, 0x03, 0x20,
	0x01, 0x28, 0x09, 0x52, 0x08, 0x63, 0x61, 0x75, 0x73, 0x65, 0x64, 0x42, 0x79, 0x22, 0x6a, 0x0a,
	0x15, 0x49, 0x6e, 0x73, 0x65, 0x72, 0x74, 0x50, 0x65, 0x6e, 0x61, 0x6c, 0x74, 0x79, 0x52, 0x65,
	0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x21, 0x0a, 0x04, 0x6d, 0x65, 0x74, 0x61, 0x18, 0x01,
	0x20, 0x01, 0x28, 0x0b, 0x32, 0x0d, 0x2e, 0x70, 0x65, 0x6e, 0x61, 0x6c, 0x74, 0x79, 0x2e, 0x4d,
	0x65, 0x74, 0x61, 0x52, 0x04, 0x6d, 0x65, 0x74, 0x61, 0x12, 0x2e, 0x0a, 0x04, 0x64, 0x61, 0x74,
	0x61, 0x18, 0x02, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x1a, 0x2e, 0x70, 0x65, 0x6e, 0x61, 0x6c, 0x74,
	0x79, 0x2e, 0x50, 0x65, 0x6e, 0x61, 0x6c, 0x74, 0x79, 0x44, 0x42, 0x52, 0x65, 0x73, 0x70, 0x6f,
	0x6e, 0x73, 0x65, 0x52, 0x04, 0x64, 0x61, 0x74, 0x61, 0x22, 0x31, 0x0a, 0x16, 0x69, 0x73, 0x55,
	0x73, 0x65, 0x72, 0x50, 0x65, 0x6e, 0x61, 0x6c, 0x69, 0x7a, 0x65, 0x64, 0x52, 0x65, 0x71, 0x75,
	0x65, 0x73, 0x74, 0x12, 0x17, 0x0a, 0x07, 0x75, 0x73, 0x65, 0x72, 0x5f, 0x69, 0x64, 0x18, 0x01,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x06, 0x75, 0x73, 0x65, 0x72, 0x49, 0x64, 0x22, 0x3c, 0x0a, 0x17,
	0x69, 0x73, 0x55, 0x73, 0x65, 0x72, 0x50, 0x65, 0x6e, 0x61, 0x6c, 0x69, 0x7a, 0x65, 0x64, 0x52,
	0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x21, 0x0a, 0x04, 0x6d, 0x65, 0x74, 0x61, 0x18,
	0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x0d, 0x2e, 0x70, 0x65, 0x6e, 0x61, 0x6c, 0x74, 0x79, 0x2e,
	0x4d, 0x65, 0x74, 0x61, 0x52, 0x04, 0x6d, 0x65, 0x74, 0x61, 0x32, 0xb7, 0x01, 0x0a, 0x0b, 0x50,
	0x65, 0x6e, 0x61, 0x6c, 0x74, 0x79, 0x47, 0x61, 0x70, 0x69, 0x12, 0x50, 0x0a, 0x0d, 0x49, 0x6e,
	0x73, 0x65, 0x72, 0x74, 0x50, 0x65, 0x6e, 0x61, 0x6c, 0x74, 0x79, 0x12, 0x1d, 0x2e, 0x70, 0x65,
	0x6e, 0x61, 0x6c, 0x74, 0x79, 0x2e, 0x49, 0x6e, 0x73, 0x65, 0x72, 0x74, 0x50, 0x65, 0x6e, 0x61,
	0x6c, 0x74, 0x79, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x1e, 0x2e, 0x70, 0x65, 0x6e,
	0x61, 0x6c, 0x74, 0x79, 0x2e, 0x49, 0x6e, 0x73, 0x65, 0x72, 0x74, 0x50, 0x65, 0x6e, 0x61, 0x6c,
	0x74, 0x79, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x22, 0x00, 0x12, 0x56, 0x0a, 0x0f,
	0x69, 0x73, 0x55, 0x73, 0x65, 0x72, 0x50, 0x65, 0x6e, 0x61, 0x6c, 0x69, 0x7a, 0x65, 0x64, 0x12,
	0x1f, 0x2e, 0x70, 0x65, 0x6e, 0x61, 0x6c, 0x74, 0x79, 0x2e, 0x69, 0x73, 0x55, 0x73, 0x65, 0x72,
	0x50, 0x65, 0x6e, 0x61, 0x6c, 0x69, 0x7a, 0x65, 0x64, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74,
	0x1a, 0x20, 0x2e, 0x70, 0x65, 0x6e, 0x61, 0x6c, 0x74, 0x79, 0x2e, 0x69, 0x73, 0x55, 0x73, 0x65,
	0x72, 0x50, 0x65, 0x6e, 0x61, 0x6c, 0x69, 0x7a, 0x65, 0x64, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e,
	0x73, 0x65, 0x22, 0x00, 0x42, 0x21, 0x5a, 0x1f, 0x6a, 0x6f, 0x6e, 0x67, 0x2d, 0x68, 0x6f, 0x6e,
	0x67, 0x2f, 0x70, 0x65, 0x6e, 0x61, 0x6c, 0x74, 0x79, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x2f,
	0x70, 0x65, 0x6e, 0x61, 0x6c, 0x74, 0x79, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_penalty_proto_rawDescOnce sync.Once
	file_penalty_proto_rawDescData = file_penalty_proto_rawDesc
)

func file_penalty_proto_rawDescGZIP() []byte {
	file_penalty_proto_rawDescOnce.Do(func() {
		file_penalty_proto_rawDescData = protoimpl.X.CompressGZIP(file_penalty_proto_rawDescData)
	})
	return file_penalty_proto_rawDescData
}

var file_penalty_proto_msgTypes = make([]protoimpl.MessageInfo, 6)
var file_penalty_proto_goTypes = []any{
	(*Meta)(nil),                    // 0: penalty.Meta
	(*PenaltyDBResponse)(nil),       // 1: penalty.PenaltyDBResponse
	(*InsertPenaltyRequest)(nil),    // 2: penalty.InsertPenaltyRequest
	(*InsertPenaltyResponse)(nil),   // 3: penalty.InsertPenaltyResponse
	(*IsUserPenalizedRequest)(nil),  // 4: penalty.isUserPenalizedRequest
	(*IsUserPenalizedResponse)(nil), // 5: penalty.isUserPenalizedResponse
}
var file_penalty_proto_depIdxs = []int32{
	0, // 0: penalty.InsertPenaltyResponse.meta:type_name -> penalty.Meta
	1, // 1: penalty.InsertPenaltyResponse.data:type_name -> penalty.PenaltyDBResponse
	0, // 2: penalty.isUserPenalizedResponse.meta:type_name -> penalty.Meta
	2, // 3: penalty.PenaltyGapi.InsertPenalty:input_type -> penalty.InsertPenaltyRequest
	4, // 4: penalty.PenaltyGapi.isUserPenalized:input_type -> penalty.isUserPenalizedRequest
	3, // 5: penalty.PenaltyGapi.InsertPenalty:output_type -> penalty.InsertPenaltyResponse
	5, // 6: penalty.PenaltyGapi.isUserPenalized:output_type -> penalty.isUserPenalizedResponse
	5, // [5:7] is the sub-list for method output_type
	3, // [3:5] is the sub-list for method input_type
	3, // [3:3] is the sub-list for extension type_name
	3, // [3:3] is the sub-list for extension extendee
	0, // [0:3] is the sub-list for field type_name
}

func init() { file_penalty_proto_init() }
func file_penalty_proto_init() {
	if File_penalty_proto != nil {
		return
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_penalty_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   6,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_penalty_proto_goTypes,
		DependencyIndexes: file_penalty_proto_depIdxs,
		MessageInfos:      file_penalty_proto_msgTypes,
	}.Build()
	File_penalty_proto = out.File
	file_penalty_proto_rawDesc = nil
	file_penalty_proto_goTypes = nil
	file_penalty_proto_depIdxs = nil
}
